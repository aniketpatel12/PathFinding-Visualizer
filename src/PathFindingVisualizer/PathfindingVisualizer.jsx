import React, {Component} from 'react';
import Node from './Node/Node';
import { aStarSearch, getNodesInShortestPathOrder  } from '../Algorithms/astarsearch';
import { dijkstra } from '../Algorithms/dijkstra';

import './PathfindingVisualizer.css';

const START_NODE_ROW = 5;
const START_NODE_COL = 10;
const TARGET_NODE_ROW = 15;
const TARGET_NODE_COL = 40;

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      animationSpeed: 10,
      timeouts: [], // Ensure timeouts is properly initialized as an empty array
      disableDropDown: false,
      isVisualized: false,
      isPaused: false,
      currentStep: 0,
    };
    this.handleAnimationSpeedChange = this.handleAnimationSpeedChange.bind(this);
    // this.handlePauseContinue = this.handlePauseContinue.bin  d(this);
    this.clearTimeouts = this.clearTimeouts.bind(this);
  }

  componentDidMount() {
    const grid = setUpInitialGrid();
    this.setState({grid});
  }

  handleAnimationSpeedChange(event){
    this.setState({ animationSpeed: event.target.value });
  }

  handleMouseDown(row, col) {
    const { grid } = this.state;
    const node = grid[row][col];

    if (node.isStart){
      this.setState({ mouseIsPressed: true, movingStartNode: true });
    }else if(node.isFinish){
      this.setState({ mouseIsPressed: true, movingTargetNode: true });
    }else{
      const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({grid: newGrid, mouseIsPressed: true});
    }
  }

  handleMouseEnter(row, col) {

    if(!this.state.mouseIsPressed) return;

    const { grid, movingStartNode, movingTargetNode }= this.state;

    if(movingStartNode){
      const newGrid = getNewGridWithNewStart(grid, row, col);
      this.setState({ grid: newGrid });
    }else if(movingTargetNode){
      const newGrid = getNewGridWithNewTarget(grid, row, col);
      this.setState({ grid: newGrid });
    }else{
      const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({grid: newGrid});
    }    
  }

  handleAlgorithmChange = (event) => {
    const selectedAlgorithm = event.target.value;
    this.setState({ selectedAlgorithm });
  };
  
  handleVisualizeClick = () => {
    const { selectedAlgorithm } = this.state;
    if (!selectedAlgorithm) {
      alert('Please select an algorithm first!');
    } else {
      if (selectedAlgorithm === 'Dijkstra') {
        this.VisualizeDijkstra();
      } else if (selectedAlgorithm === 'A* Search Algorithm') {
        this.VisualizeAStarSearch();
      }
    }
  };
  
  clearTimeouts = () => {
    const { timeouts } = this.state;
    for (let i = 0; i < timeouts.length; i++) {
      clearTimeout(timeouts[i]);
    }
    this.setState({ timeouts: [] });
  };
  
  clearAll() {
    this.clearTimeouts();
    const newGrid = setUpInitialGrid();
    for (let row = 0; row < newGrid.length; row++) {
        for (let col = 0; col < newGrid[row].length; col++) {
            const node = newGrid[row][col];
            const nodeElement = document.getElementById(`node-${node.row}-${node.col}`);
            nodeElement.className = 'node';
            node.isWall = false;
            node.isVisited = false;
            node.distance = Infinity;
            node.previousNode = null;
        }
    }
    const startNodeElement = document.getElementById(`node-${START_NODE_ROW}-${START_NODE_COL}`);
    const targetNodeElement = document.getElementById(`node-${TARGET_NODE_ROW}-${TARGET_NODE_COL}`);
    startNodeElement.className = 'node node-start';
    targetNodeElement.className = 'node node-finish';
    this.setState({ grid: newGrid, disableDropDown: false, isVisualized: false });
  }

  clearPath() {
    const { grid } = this.state;
    for (let row = 0; row < grid.length; row++){
      for (let col = 0; col < grid[row].length; col++){
        const node = grid[row][col];
        const nodeElement = document.getElementById(`node-${node.row}-${node.col}`);
        if (node.isVisited && !node.isStart && !node.isFinish) {
          nodeElement.className = 'node';
          node.isVisited = false;
        }
      }
    }
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    const { animationSpeed, currentStep } = this.state;
    const timeouts = [];
    for (let i = currentStep; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        timeouts.push(
          setTimeout(() => {
            this.animateShortestPath(nodesInShortestPathOrder);
          }, animationSpeed * i)
        );
        this.setState({ timeouts });
        return;
      }
      timeouts.push(
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        const nodeClassName = document.getElementById(`node-${node.row}-${node.col}`).className;
        if (nodeClassName !== 'node node-start' && nodeClassName !== 'node node-finish') {
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited';
        }
        setTimeout(() => {
          this.setState({ isVisualized: false, disableDropDown: false });
        }, animationSpeed * i);
      }, animationSpeed * i)
      );
    }
    this.setState( {timeouts} );
  }

  // Animate A* Search
  animateAStarSearch(visitedNodesInOrder, nodesInShortestPathOrder) {
    const { animationSpeed } = this.state;
    for (let i = 0; i < visitedNodesInOrder.length; i++) {
        setTimeout(() => {
            const node = visitedNodesInOrder[i];
            const nodeClassName = document.getElementById(`node-${node.row}-${node.col}`).className;
            if (nodeClassName !== 'node node-start' && nodeClassName !== 'node node-finish') {
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited';
            }
        }, animationSpeed * i);
    }

    setTimeout(() => {
        this.animateShortestPathAStar(nodesInShortestPathOrder);
        setTimeout(() => {
          this.setState({ isVisualized: false, disableDropDown: false });
      }, animationSpeed * visitedNodesInOrder.length);
    }, animationSpeed * visitedNodesInOrder.length);
  }

  animateShortestPathAStar(nodesInShortestPathOrder) {
    const { animationSpeed } = this.state;
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
        setTimeout(() => {
            const node = nodesInShortestPathOrder[i];
            const nodeClassName = document.getElementById(`node-${node.row}-${node.col}`).className;
            if (nodeClassName !== 'node node-start' && nodeClassName !== 'node node-finish') {
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-shortest-path';
            }
        }, animationSpeed * i);
    }
  }
  
  animateShortestPath(nodesInShortestPathOrder) {
    const { animationSpeed } = this.state;
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        const nodeClassName = document.getElementById(`node-${node.row}-${node.col}`).className;
        if (nodeClassName !== 'node node-start' && nodeClassName !== 'node node-finish') {
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-shortest-path';
        }
      }, animationSpeed * i);
    }
  }

  handleMouseUp() {
    this.setState({mouseIsPressed: false, movingStartNode: false, movingTargetNode: false});
  }

  VisualizeDijkstra(){
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const targetNode = grid[TARGET_NODE_ROW][TARGET_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, targetNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(targetNode);
    this.setState({ isVisualized: true });
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  VisualizeAStarSearch() {
    console.log("Inside VisualizeAStarSearch()...");
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const targetNode = grid[TARGET_NODE_ROW][TARGET_NODE_COL];
    const visitedNodesInOrder = aStarSearch(grid, startNode, targetNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(targetNode);
    this.setState({ isVisualized: true });
    this.animateAStarSearch(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  render(){
    
    const {grid, mouseIsPressed, disableDropDown, isVisualized, isPaused} = this.state;
    const algorithms = ['Select an algorithm', 'Dijkstra', 'A* Search Algorithm'];
    const { isAlgorithmSelected } = this.state;
    
    return(
        <>
            <div className="select-container">
              <select
                value={this.state.animationSpeed}
                onChange={this.handleAnimationSpeedChange}
                disabled={disableDropDown || isVisualized}
                className="custom-select"
              >
                <option value="10">Fastest</option>
                <option value="20">Fast</option>
                <option value="50">Normal</option>
                <option value="70">Slow</option>
                <option value="100">Slowest</option>
              </select>
            </div>
            <div className="select-container">
              <select
                value={this.state.selectedAlgorithm}
                onChange={this.handleAlgorithmChange}
                disabled={disableDropDown || isVisualized}
              >
                {algorithms.map((algorithm, index) => (
                  <option key={index} value={algorithm}>
                    {algorithm}
                  </option>
                ))}
              </select>
            </div>
            <button onClick={this.handleVisualizeClick} disabled={disableDropDown || isVisualized}>
              Visualize
            </button>
            {isAlgorithmSelected === false && (
              <div className="alert">
                Please select an algorithm first!
              </div>
            )}
            <button className={disableDropDown || isVisualized ? 'disabled-button' : ''} onClick={() => this.clearAll()} disabled={isVisualized || disableDropDown}>
                Clear All
            </button>
            <button className={disableDropDown || isVisualized ? 'disabled-button' : ''} onClick={() => this.clearPath()} disabled={isVisualized || disableDropDown}>
                Clear Path
            </button>
            {/* <button onClick={this.handlePauseContinue} className="pause-continue-btn">
                {isPaused ? 'Continue' : 'Pause'}
            </button> */}
            <div className='grid'>
                {grid.map((row, rowIdx) => {
                    return (
                        <div key={rowIdx}>
                            {row.map((node, nodeIdx) => {
                                const {row, col, isStart, isFinish, isWall} = node;
                                return (
                                    <Node 
                                        key={nodeIdx} 
                                        col={col}
                                        isFinish={isFinish}
                                        isStart={isStart} 
                                        isWall={isWall}
                                        mouseIsPressed={mouseIsPressed}
                                        onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                                        onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                                        onMouseUp={() => this.handleMouseUp()}
                                        row={row} 
                                        ></Node>
                                    );
                            })}
                        </div>
                    );
                })}
            </div>
        </>
    );
  }
}

// create the initialGrid setup
const setUpInitialGrid = () => {
    const grid = [];
    for (let row =0; row < 20; row++){
        const currentRow = [];
        for (let col = 0; col < 50; col++){
            currentRow.push(createNode(col, row));
        }
        grid.push(currentRow);
    }
    return grid;
}

// Create a node structure for the grid
const createNode = (col, row) => {
    return {
      col,
      row,
      isStart: row === START_NODE_ROW && col === START_NODE_COL,
      isFinish: row === TARGET_NODE_ROW && col === TARGET_NODE_COL,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
    };
};
  
const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const getNewGridWithNewStart = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isStart: true,
  };
  newGrid[row][col] = newNode;
  return newGrid;
}

const getNewGridWithNewTarget = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isFinish: true,
  };
  newGrid[row][col] = newNode;
  return newGrid;

}
