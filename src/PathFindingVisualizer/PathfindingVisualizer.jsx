import React, {Component} from 'react';
import Node from './Node/Node';

import './PathfindingVisualizer.css';

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
        nodes: [],
    };
  }

  componentDidMount() {
    const nodes = [];
    for (let row = 0; row < 20; row ++){
        const currentRow = [];
        for (let col = 0; col < 50; col++){
            const currentNode = {
                col,
                row,
                isStart: row == 10 && col == 5,
                isFinish: row == 15 && col == 45,
            }
            currentRow.push(currentNode);
        }
        nodes.push(currentRow);
    }
    this.setState({nodes});
  }

  render(){
    
    const {nodes} = this.state;
    console.log(nodes)
    
    return(
        <div className='grid'>
            {nodes.map((row, rowIdx) => {
                return (
                    <div key={rowIdx}>
                        {row.map((node, nodeIdx) => {
                            const {isStart, isFinish} = node;
                            return (
                                <Node 
                                    key={nodeIdx} 
                                    isStart={isStart} 
                                    isFinish={isFinish}
                                    test={'foo'} 
                                    ></Node>
                                );
                        })}
                    </div>
                );
            })}
        </div>
    );
  }
}