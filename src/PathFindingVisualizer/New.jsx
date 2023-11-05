import React, { useState, useEffect } from 'react';
import Node from './Node/Node';
import { aStarSearch, getNodesInShortestPathOrder } from '../Algorithms/astarsearch';
import { dijkstra } from '../Algorithms/dijkstra';
import './PathfindingVisualizer.css';

const START_NODE_ROW = 5;
const START_NODE_COL = 15;
const TARGET_NODE_ROW = 0;
const TARGET_NODE_COL = 0;

const PathfindingVisualizer = () => {
  const [grid, setGrid] = useState([]);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(10);
  const [timeouts, setTimeouts] = useState([]);
  const [disableDropDown, setDisableDropDown] = useState(false);
  const [isVisualized, setIsVisualized] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const grid = setUpInitialGrid();
    setGrid(grid);
  }, []);

  const handleAnimationSpeedChange = (event) => {
    setAnimationSpeed(event.target.value);
  };

  const handleMouseDown = (row, col) => {
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    setGrid(newGrid);
    setMouseIsPressed(true);
  };

  const handleMouseEnter = (row, col) => {
    if (!mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    setGrid(newGrid);
  };

  const handlePauseContinue = () => {
    if (isVisualized) {
      if (isPaused) {
        setIsPaused(false);
        animateDijkstra(currentStep, timeouts);
      } else {
        setIsPaused(true);
        for (let i = currentStep; i < timeouts.length; i++) {
          clearTimeout(timeouts[i]);
        }
      }
    }
  };

  const clearTimeouts = () => {
    for (let i = 0; i < timeouts.length; i++) {
      clearTimeout(timeouts[i]);
    }
    setTimeouts([]);
  };

  const clearAll = () => {
    clearTimeouts();
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
    setGrid(newGrid);
    setDisableDropDown(false);
    setIsVisualized(false);
  };

  const animateDijkstra = (visitedNodesInOrder, nodesInShortestPathOrder) => {
    const timeouts = [];
    for (let i = currentStep; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        timeouts.push(
          setTimeout(() => {
            animateShortestPath(nodesInShortestPathOrder);
          }, animationSpeed * i)
        );
        setTimeouts(timeouts);
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
            setIsVisualized(false);
            setDisableDropDown(false);
          }, animationSpeed * i);
        }, animationSpeed * i)
      );
    }
    setTimeouts(timeouts);
  };

  function animateAStarSearch(visitedNodesInOrder, nodesInShortestPathOrder) {
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

  function animateShortestPathAStar(nodesInShortestPathOrder) {
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
  
  function animateShortestPath(nodesInShortestPathOrder) {
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

  function handleMouseUp() {
    this.setState({mouseIsPressed: false});
  }

  function VisualizeDijkstra(){
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const targetNode = grid[TARGET_NODE_ROW][TARGET_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, targetNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(targetNode);
    this.setState({ isVisualized: true });
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  function VisualizeAStarSearch() {
    console.log("Inside VisualizeAStarSearch()...");
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const targetNode = grid[TARGET_NODE_ROW][TARGET_NODE_COL];
    const visitedNodesInOrder = aStarSearch(grid, startNode, targetNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(targetNode);
    this.setState({ isVisualized: true });
    this.animateAStarSearch(visitedNodesInOrder, nodesInShortestPathOrder);
  }

    return(
        <>
        <select 
            value={this.state.animationSpeed} 
            onChange={this.handleAnimationSpeedChange}
            disabled={disableDropDown || isVisualized}>
                <option value="10">Fastest</option>
                <option value="20">Fast</option>
                <option value="50">Normal</option>
                <option value="70">Slow</option>
                <option value="100">Slowest</option>
            </select>
            <button onClick={() => this.VisualizeDijkstra()} disabled={disableDropDown || isVisualized}>
                Visualize Dijkstra'S Algorithm
            </button>
            <button onClick={() => this.VisualizeAStarSearch()} disabled={disableDropDown || isVisualized}>
                Visualize A* Algorithm
            </button>
            <button onClick={() => this.clearAll()} disabled={isVisualized || disableDropDown}>
                Clear All
            </button>
            <button onClick={this.handlePauseContinue} className="pause-continue-btn">
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
};

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

export default PathfindingVisualizer;
