// Perform Depth-First Search Algorithm
export function depthFirstSearch(grid, startNode, targetNode) {
  const visitedNodesInOrder = [];
  const stack = [];
  stack.push(startNode);

  while (stack.length) {
      const currentNode = stack.pop();
      if (currentNode.isWall) continue;
      if (currentNode.isVisited) continue;
      currentNode.isVisited = true;
      visitedNodesInOrder.push(currentNode);
      if (currentNode === targetNode) return visitedNodesInOrder;

      const unvisitedNeighbors = getUnvisitedNeighbors(currentNode, grid);
      for (const neighbor of unvisitedNeighbors) {
          neighbor.previousNode = currentNode;
          stack.push(neighbor);
      }
  }
  return visitedNodesInOrder;
}

// Get unvisited neighbors for DFS Search
function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { col, row } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter(neighbor => !neighbor.isVisited);
}

// Get nodes in the shortest path order
export function getNodesInShortestPathOrder(targetNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = targetNode;
  while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
