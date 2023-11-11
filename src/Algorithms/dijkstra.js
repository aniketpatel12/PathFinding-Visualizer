// Perform Dijkstra's ALgorithm 
// It return all the nodes in the order in which they were visited.
// Alos this makes nodesp point back to their previous node and effectively allowing to compute the shortest path
// FOllows the backtrack from the TargetNode
export function dijkstra(grid, startNode, targetNode){
    const visitedNodesInOrder = [];
    
    startNode.distance = 0;
    const unVisitedNodes = getAllNodes(grid);    
    while(!!unVisitedNodes.length){
        sortNodesByDistance(unVisitedNodes);
        const closestNode = unVisitedNodes.shift();
        if (closestNode.isWall) continue;
        if (closestNode.distance === Infinity) return visitedNodesInOrder;
        closestNode.isVisited = true;
        visitedNodesInOrder.push(closestNode);
        if (closestNode === targetNode) return visitedNodesInOrder;
        updateUnvisitedNeighbors(closestNode, grid);
    }
}

// Used to sort the nodes by the distance
function sortNodesByDistance(unVisitedNodes) {
    unVisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

// Return the ClosestNodes from the currentNode
function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const {col, row} = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(neighbor => !neighbor.isVisited);
}
  
// Update the unvisited Neighbors node
function updateUnvisitedNeighbors(node, grid) {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
      neighbor.distance = node.distance + 1;
      neighbor.previousNode = node;
    }
}

// Return all the initial nodes
function getAllNodes(grid) {
    const nodes = [];
    for (const row of grid){
        for (const node of row){
            nodes.push(node);   
        }
    }
    return nodes;
}

// Backtracks from the targetNode to find the shortest path.
// Only works when called *after* the dijkstra method above.
export function getNodesInShortestPathOrder(targetNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = targetNode;
    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
  }

