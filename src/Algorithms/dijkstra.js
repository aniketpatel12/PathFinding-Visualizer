const node = {
    row, 
    col,
    isVisited,
    distance,
};

// Perform Dijkstra's ALgorithm 
// It return all the nodes in the order in which they were visited.
// Alos this makes nodesp point back to their previous node and effectively allowing to compute the shortest path
// FOllows the backtrack from the TargetNode
function dijkstra(gird, startNode, targetNode){
    if (!startNode || !targetNode || startNode==targetNode){
        return false; 
    }

    nodes[startNode].distance = 0;
    const unVisitedNodes = nodes.slice();    
    while(!!unVisitedNodes.length){
        sortNodesByDistance(unVisitedNodes)
        const closestNode = unVisitedNodes.unshit();
        // while(currentNode.status == "wall" && unVisitedNodes.length){
        //     currentNode = getClosestNode(nodes, unVisitedNodes);
        // }
        // if(closestNode.distance == Infinity){
        //     return false;
        // }
            
        closestNode.isVisited = true;
        if(closestNode.id === targetNode) return "Success!";
        updateNeighbors(nodes, currentNode, boardArray);
    }
}

// Used to sort the nodes by the distance
function sortNodesByDistance(unVisitedNodes) {
    unVisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

// Return the ClosestNodes from the currentNode
function getClosestNode(node, grid){
    const neighbors = [];
    const {row, col} = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col-1]);
    if (col < grid.length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(neighbor => !neighbor.isVisited);
}

// Backtracks from the targetNode to find the shortest path
// But only works when called After dijkstra() above
function updateNeighbors(node, gird){
    let neighbors = getNeighbors(node, grid);
    for (const neighbor of neighbors){
        neighbor.distance = node.distance + 1;
    }
}

