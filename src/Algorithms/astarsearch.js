// Perform A* Search Algorithm
export function aStarSearch(grid, startNode, targetNode) {
    const visitedNodesInOrder = [];
    startNode.distance = 0;
    const unvisitedNodes = getAllNodes(grid);
    unvisitedNodes.forEach(node => {
        node.heuristic = heuristic(node, targetNode);
    });

    while (unvisitedNodes.length) {
        sortNodesByDistanceAndHeuristic(unvisitedNodes);
        const currentNode = unvisitedNodes.shift();
        if (currentNode.isWall) continue;
        if (currentNode.distance === Infinity) return visitedNodesInOrder;
        currentNode.isVisited = true;
        visitedNodesInOrder.push(currentNode);
        if (currentNode === targetNode) return visitedNodesInOrder;
        updateUnvisitedNeighbors(currentNode, grid, targetNode);
    }
}

// Heuristic function for A* Search
function heuristic(nodeA, nodeB) {
    const dX = Math.abs(nodeA.col - nodeB.col);
    const dY = Math.abs(nodeA.row - nodeB.row);
    return dX + dY;
}

// Update the unvisited Neighbors node
function updateUnvisitedNeighbors(node, grid, targetNode) {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
        const distanceToNeighbor = node.distance + 1;
        if (distanceToNeighbor < neighbor.distance) {
            neighbor.distance = distanceToNeighbor;
            neighbor.previousNode = node;
            neighbor.heuristic = heuristic(neighbor, targetNode);
        }
    }
}

// Sort nodes by distance and heuristic value
function sortNodesByDistanceAndHeuristic(unVisitedNodes) {
    unVisitedNodes.sort((nodeA, nodeB) => nodeA.distance + nodeA.heuristic - (nodeB.distance + nodeB.heuristic));
}

// Get unvisited neighbors for A* Search
function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const { col, row } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(neighbor => !neighbor.isVisited);
}

// Get all nodes from the grid
function getAllNodes(grid) {
    const nodes = [];
    for (const row of grid) {
        for (const node of row) {
            nodes.push(node);
        }
    }
    return nodes;
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
