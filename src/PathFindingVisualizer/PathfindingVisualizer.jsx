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
    };
  }

  componentDidMount() {
    const grid = setUpInitialGrid();
    this.setState({grid});
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

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder){
    for (let i=0; i<= visitedNodesInOrder.length; i++){
      if (i === visitedNodesInOrder.length){
        setTimeout(() => {
          this.animateShotestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() =>{
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className = 
        'node node-visited';
      }, 10 * i);
    }
  }

  animateShotestPath(nodesInShortestPathOrder){
    for (let i = 0; i < nodesInShortestPathOrder.length; i++){
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
        'node node-shortest-path';
      }, 50 * i);
    }
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
  }

  render(){
    
    const {grid, mouseIsPressed} = this.state;
    // console.log(nodes)
    
    return(
        <>
            <button onClick={() => this.VisualizeDijkstra()}>
                Visualize Dijkstra'S Algorithm
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

const onClearAll = () => {
  // if (isVisited) return;
  clear();
}

const clear = () =>{
  const grid = setUpInitialGrid();
  this.setState({grid});
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