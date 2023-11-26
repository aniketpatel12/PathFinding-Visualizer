import React, {Component} from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import Node from './Node/Node';
import { aStarSearch, getNodesInShortestPathOrder  } from '../Algorithms/astarsearch';
import { dijkstra } from '../Algorithms/dijkstra';
import { depthFirstSearch } from '../Algorithms/dfs';
import { bfs } from '../Algorithms/bfs';
import './PathfindingVisualizer.css';
import  './Node/Node.css'
import githubLogo from './Node/github-mark.png'

let START_NODE_ROW = 7;
let START_NODE_COL = 4;
let TARGET_NODE_ROW = 7;
let TARGET_NODE_COL = 30;

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
      isAlertVisible: false,
      alertMessage: {
        message: '',
        show: false,
      },
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
    const { grid, isVisualized } = this.state;
    const node = grid[row][col];

    if (isVisualized){
      return;
    }

    if (node.isStart){
      this.setState({ mouseIsPressed: true, movingStartNode: true, previousNode: node });
    }else if(node.isFinish){
      this.setState({ mouseIsPressed: true, movingTargetNode: true, previousNode: node });
    }else{
      const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({grid: newGrid, mouseIsPressed: true});
    }
  }

  handleMouseEnter(row, col) {

    if(!this.state.mouseIsPressed) return;

    const { grid, movingStartNode, movingTargetNode, previousNode, isVisualized }= this.state;

    if (isVisualized){
      return;
    }

    if(movingStartNode){
      const newGrid = getNewGridWithNewStart(grid, row, col);
      if (previousNode) {
        const resetNode = {
          ...previousNode,
          isStart: false,
        };
        newGrid[previousNode.row][previousNode.col] = resetNode;
      }
      this.setState({ grid:newGrid, previousNode: grid[row][col] });
      START_NODE_ROW = row;
      START_NODE_COL = col;
    }else if(movingTargetNode){
      const newGrid = getNewGridWithNewTarget(grid, row, col);
      if (previousNode){
        const resetNode = {
          ...previousNode,
          isFinish: false,
        };
        newGrid[previousNode.row][previousNode.col] = resetNode;
      }
      this.setState({ grid:newGrid, previousNode: grid[row][col] });
      TARGET_NODE_ROW = row;
      TARGET_NODE_COL = col;
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

    const { grid } = this.state;
    let startNodeSurrounded = true;
    let targetNodeSurrounded = true;

    // Check if startNode is surrounded by walls
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        if (grid[row][col].isStart) {
          startNodeSurrounded = this.areNeighboringNodesWalls(row, col, grid);
        } else if (grid[row][col].isFinish) {
          targetNodeSurrounded = this.areNeighboringNodesWalls(row, col, grid);
        }
      }
    }

    if (startNodeSurrounded) {
      const message = `START NODE IS FULLY COVERED WITH WALLS!\n` + 
                      `PLEASE ADUST THE WALLS.\n`;
      this.showAlert(message);
      return;
    }

    if (targetNodeSurrounded) {
      const message = `START NODE IS FULLY COVERED WITH WALLS!\n` + 
                      `PLEASE ADUST THE WALLS.\n`;
      this.showAlert(message);
      return; 
    }
  
    switch (selectedAlgorithm) {
      case 'A* Search':
        this.VisualizeAStarSearch();
        break;
      case 'BFS':
        this.VisualizeBFS();
        break;
      case 'DFS':
        this.VisualizeDFS();
        break;
      case 'Dijkstra':
        this.VisualizeDijkstra();
        break;
      default:
        this.showAlert('Please Algorithm first!');
    }
  };

  isNodeFullyCovered = (grid, node) => {
    const { row, col } = node;

    // Check if the node is covered with walls
    return grid[row][col].isWall;
  };

  areNeighboringNodesWalls = (row, col, grid) => {
    const neighbors = this.getNeighbors(row, col, grid);

    for (const neighbor of neighbors) {
      const { row: neighborRow, col: neighborCol } = neighbor;
      if (!grid[neighborRow][neighborCol].isWall) {
        return false;
      }
    }

    return true;
  };

  getNeighbors = (row, col, grid) => {
    const neighbors = [];
    if (row > 0) neighbors.push({ row: row - 1, col });
    if (row < grid.length - 1) neighbors.push({ row: row + 1, col });
    if (col > 0) neighbors.push({ row, col: col - 1 });
    if (col < grid[0].length - 1) neighbors.push({ row, col: col + 1 });
    return neighbors;
  };

  showAlert(message) {
    Swal.fire({
      title: 'ERROR',
      html: '<pre>' + message + '</pre>',
      customClass: {
        popup: 'description'
      },
      icon: 'error',
      confirmButtonColor: '#2ecc71',
      confirmButtonText: 'OK'
    });
  } 

  showInfo(message){
    Swal.fire({
      html: '<pre>' + message + '</pre>',
      customClass: {
        popup: 'description'
      },
      icon: 'success',
      title: "VISUALIZATION COMPLETED",
      confirmButtonColor: '#2ecc71',
      confirmButtonText: 'Ok'
    });
  }

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
        this.animateShortestPath(nodesInShortestPathOrder);
        setTimeout(() => {
          this.setState({ isVisualized: false, disableDropDown: false });
          
          // Show the result of the Algorithm after Visualization
          this.showAlgorithmResults(visitedNodesInOrder, nodesInShortestPathOrder); 
      }, animationSpeed * visitedNodesInOrder.length);
    }, animationSpeed * visitedNodesInOrder.length);
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
          // Show the result of the Algorithm after Visualization
          this.showAlgorithmResults(visitedNodesInOrder, nodesInShortestPathOrder);
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

  animateDFS(visitedNodesInOrder, nodesInShortestPathOrder) {
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
      this.animateShortestPath(nodesInShortestPathOrder);
      setTimeout(() => {
        this.setState({ isVisualized: false, disableDropDown: false });
        // Show the result of the Algorithm after Visualization
        this.showAlgorithmResults(visitedNodesInOrder, nodesInShortestPathOrder);
      }, animationSpeed * nodesInShortestPathOrder.length);
    }, animationSpeed * visitedNodesInOrder.length);
  }

  animateBFS(visitedNodesInOrder, nodesInShortestPathOrder){
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
      this.animateShortestPath(nodesInShortestPathOrder);
      setTimeout(() => {
        this.setState({ isVisualized: false, disableDropDown: false });
        // Show the result of the Algorithm after Visualization
        this.showAlgorithmResults(visitedNodesInOrder, nodesInShortestPathOrder);
      }, animationSpeed * visitedNodesInOrder.length);
    }, animationSpeed * visitedNodesInOrder.length);
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

  VisualizeDFS() {
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const targetNode = grid[TARGET_NODE_ROW][TARGET_NODE_COL];
    const visitedNodesInOrder = depthFirstSearch(grid, startNode, targetNode); // Call the DFS algorithm
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(targetNode);
    this.setState({ isVisualized: true });
    this.animateDFS(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  VisualizeBFS() {
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const targetNode = grid[TARGET_NODE_ROW][TARGET_NODE_COL];
    const visitedNodesInOrder = bfs(grid, startNode, targetNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(targetNode);
    this.setState({ isVisualized: true });
    this.animateBFS(visitedNodesInOrder, nodesInShortestPathOrder);
  }
  
  showAlgorithmResults(visitedNodes, nodesInShortestPathOrder){
    const isPathFound = visitedNodes.some(node => node.row === TARGET_NODE_ROW && node.col === TARGET_NODE_COL);    console.log(isPathFound)
    const message = `TOTAL NO. OF VISITED NODES: ${visitedNodes.length}\n` + 
                    `TOTAL NO. OF VISITED NODES IN SHOTEST PATH: ${nodesInShortestPathOrder.length}\n`;
    if (isPathFound) {
      this.showInfo(message);
    } else{
      const errorMessage = `CANNOT FIND A PATH!`
      this.showAlert(errorMessage)
    }
  }

  showUserManual(){
    Swal.fire({
      title: 'HOW TO USE?',
      html: `
      <div class="title-line"></div><br>
      <div class="how-to-use-item">
        <div class="node node-start"></div>
        <div class="description">Start Node</div>
        <div class="node node-finish"></div>
        <div class="description">Target Node</div>
      </div>
      <div class="how-to-use-item">
        <div class="node node-shortest"></div>
        <div class="description">Shortest Node</div>
        <div class="node node-visited"></div>
        <div class="description">Visited Node</div>
      </div>
      <div class="how-to-use-item">
        <div class="node node-wall"></div>
        <div class="description">Wall Node - Click to Place or Remove</div>
      </div>
      <div class="how-to-use-item">
        <div class="information-line"></div>
      </div>
      <div class="how-to-use-item">
        <div class="description">1. Move Start Node and Target Node by dragging</div>
      </div>
      <div class="how-to-use-item">
        <div class="description">2. Make Walls by clicking on any node</div>
      </div>
      <div class="how-to-use-item">
        <div class="description">3. Move the wall by dragging</div>
      </div>
      <div class="how-to-use-item">
        <div class="description">4. Select the Animation Speed and Algorithm from the drop-down menu</div>
      </div>
      <div class="how-to-use-item">
        <div class="description">5. Visualize the Selected Algorithm</div>
      </div>
      `,
      confirmButtonText: 'Ok',
      confirmButtonColor: '#2ecc71'
    });
  }

resetGrid() {
  const { grid } = this.state;
  
  // Clear visited nodes
  const newGrid = grid.map(row =>
    row.map(node => ({
      ...node,
      isVisited: false,
      distance: Infinity,
      previousNode: null,
      isShortestPath: false,
    }))
  );

  this.setState({
    grid: newGrid,
    mouseIsPressed: false,
  });
}

render() {

  const {grid, mouseIsPressed, disableDropDown, isVisualized} = this.state;
  const algorithms = ['Algorithm', 'A* Search','BFS', 'DFS', 'Dijkstra'];
  const { isAlgorithmSelected } = this.state;
  const title = "PATHFINDING  VISUALIZER";
  const lastLetter = title.charAt(title.length - 1);
  return (
    <>
        <div className="header">
          <span className="first-letter">{title[0]}</span>
          {title.substring(1, title.length - 1)}
          <span className="last-letter">{lastLetter}</span>
        </div>
        <div className='control-panel'>
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
              className="custom-select"
            >
              {algorithms.map((algorithm, index) => (
                <option key={index} value={algorithm}>
                  {algorithm}
                </option>
              ))}
            </select>
          </div>
          <div className="button-container">
            <button onClick={this.handleVisualizeClick} disabled={disableDropDown || isVisualized}>
              Visualize
            </button>
            {isAlgorithmSelected === false && (
              <div className="alert">
                Please Algorithm first!
              </div>
            )}
            <button className={disableDropDown || isVisualized ? 'disabled-button' : ''} onClick={() => this.clearAll()} disabled={isVisualized || disableDropDown}>
              Clear All
            </button>
            <button className={disableDropDown || isVisualized ? 'disabled-button' : ''} onClick={() => this.clearPath()} disabled={isVisualized || disableDropDown}>
              Clear Path
            </button>
            <button className={disableDropDown || isVisualized ? 'disabled-button' : ''} onClick={() => this.showUserManual()} disabled={isVisualized || disableDropDown}>
              How to use?
            </button>
          </div>
        </div>
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

            <div className="footer">
              <span> MADE BY ANIKET PATEL  </span>
              <a href="https://github.com/aniketpatel12/PathFinding-Visualizer" target="_blank" rel="noopener noreferrer">
                <img src={githubLogo} alt="GitHub Logo" className="github-logo" />
              </a>
            </div>
      </>
    );
  }
}
  
// create the initialGrid setup
const setUpInitialGrid = () => {
    const grid = [];
    for (let row =0; row < 13; row++){
        const currentRow = [];
        for (let col = 0; col < 34; col++){
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

