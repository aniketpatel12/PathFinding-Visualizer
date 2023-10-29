import React, {Component} from 'react';
import Node from './Node/Node';

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

  handleMouseUp() {
    this.setState({mouseIsPressed: false});
  }

  VisualizeDijkstra(){
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const targetNode = grid[TARGET_NODE_ROW][TARGET_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, targetNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder()
  }

  render(){
    
    const {nodes} = this.state;
    console.log(nodes)
    
    return(
        <>
            <button onClick={() => this.VisualizeDijkstra()}>
                Visualize Dijkstra'S Algorithm
            </button>
            <div className='grid'>
                {nodes.map((row, rowIdx) => {
                    return (
                        <div key={rowIdx}>
                            {row.map((node, nodeIdx) => {
                                const {row, col, isStart, isFinish, isWall} = node;
                                return (
                                    <Node 
                                        key={nodeIdx} 
                                        col={col}
                                        isStart={isStart} 
                                        isFinish={isFinish}
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

const setUpInitialGrid = () => {
    const grid = [];
    for (let row =0; row < 20; row++){
        const currentRow = [];
        for (let col = 0; col < 50; col++){
            currentRow.push(creatNode(col, row));
        }
        grid.push(currentRow);
    }
    return grid;
}

const createNode = (col, row) => {
    return {
      col,
      row,
      isStart: row === START_NODE_ROW && col === START_NODE_COL,
      isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
    };
  };
  