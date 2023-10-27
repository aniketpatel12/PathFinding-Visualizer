import React, {Component} from 'react';

import './Node.css';

export default class Node extends Component {
  constructor(props){
    super(props);
    this.state = {};
  }

  render(){
    const {isFInish, isStart} = this.props;
    const extraClassName = isFInish ? 'node-finish' : isStart ? 'node-start' : '';
    return <div className={`node ${extraClassName}`}></div>
  }
}

export const DEFAULT_NODE = {
    row: 0,
    col: 0,
};