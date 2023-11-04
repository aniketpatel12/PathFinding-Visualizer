import React, {Component} from 'react';
import Node from './Node/Node';
import { dijkstra, getNodesInShortestPathOrder } from '../Algorithms/dijkstra';

import './PathfindingVisualizer.css';

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const TARGET_NODE_ROW = 10;
const TARGET_NODE_COL = 35;

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      animationSpeed: 10,
      isPaused: false,
      timeouts: [], // Ensure timeouts is properly initialized as an empty array
      disableDropDown: false,
      isVisualized: false,
    };
    this.handleAnimationSpeedChange = this.handleAnimationSpeedChange.bind(this);
    this.handlePauseContinue = this.handlePauseContinue.bind(this);
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
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid, mouseIsPressed: true});
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid});
  }

  handlePauseContinue() {
    const { isPaused, timeouts, isVisualized } = this.state;
    if (isVisualized && timeouts) {
      if (isPaused) {
        this.setState({ isPaused: false });
        this.animateDijkstra(this.state.currentStep);
      } else {
        this.setState({ isPaused: true });
        for (let i = 0; i < timeouts.length; i++) {
          clearTimeout(timeouts[i]);
        }
      }
    }
  }
  
  clearTimeouts() {
    const { timeouts } = this.state;
    for (let i = 0; i< timeouts.length; i++){
      this.clearTimeouts(timeouts[i]);
    }
    this.setState({ timeouts: [] });
  }

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

  animateDijkstra(step) {
    const { animationSpeed, isPaused, visitedNodesInOrder, nodesInShortestPathOrder } = this.state;
    let currentStep = step || 0;
    if (!this.state.timeouts) {
      this.setState({ timeouts: [] });
    }
    for (let i = currentStep; i < visitedNodesInOrder.length; i++) {
      const timeout = setTimeout(() => {
        if (!isPaused) {
          const node = visitedNodesInOrder[i];
          // Update UI here for visited node
          if (i === visitedNodesInOrder.length - 1) {
            this.animateShortestPath(nodesInShortestPathOrder);
          }
        }
      }, animationSpeed * i);
      this.setState(prevState => ({ timeouts: [...prevState.timeouts, timeout] }));
    }
    this.setState({ currentStep });
  }
  

  animateShortestPath(nodesInShortestPathOrder) {
    const { animationSpeed, isPaused } = this.state;
    let currentStep = this.state.currentStep || 0;
    for (let i = currentStep; i < nodesInShortestPathOrder.length; i++) {
        const timeout = setTimeout(() => {
            if (!isPaused) {
                const node = nodesInShortestPathOrder[i];
                // Update UI here for shortest path node
            }
        }, animationSpeed * i);
        this.state.timeouts.push(timeout);
    }
    this.setState({ currentStep: 0 });
  }

  handleMouseUp() {
    this.setState({mouseIsPressed: false});
  }

  VisualizeDijkstra(){
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const targetNode = grid[TARGET_NODE_ROW][TARGET_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, targetNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(targetNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    this.setState({ isVisualized: true });
  }

  render(){
    
    const {grid, mouseIsPressed, animationSpeed, disableDropDown, isVisualized, isPaused} = this.state;
    // console.log(nodes)
    
    return(
        <>
          <select 
              value={this.state.animationSpeed} 
              onChange={this.handleAnimationSpeedChange}
              disabled={disableDropDown || isVisualized}>
                <option value="10">Fastest</option>
                <option value="50">Fast</option>
                <option value="100">Normal</option>
                <option value="200">Slow</option>
                <option value="500">Slowest</option>
            </select>
            <button onClick={() => this.VisualizeDijkstra()} disabled={disableDropDown || isVisualized}>
                Visualize Dijkstra'S Algorithm
            </button>
            <button onClick={() => this.clearAll()}>
                Clear All
            </button>
            <button onClick={this.handlePauseContinue} disabled={!isVisualized} className="pause-continue-btn">
                {isPaused ? 'Continue' : 'Pause'}
            </button>
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