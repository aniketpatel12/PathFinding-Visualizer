// BFS Algorithm
export function bfs(grid, startNode, targetNode){
    const visitedNodesInOrder = [];
    const queue = [];

    startNode.distance = 0;

    queue.push(startNode);

    while(queue.length > 0){
        const currentNode = queue.shift();
        if (currentNode.isWall) continue;
        if (currentNode === targetNode){
            return visitedNodesInOrder;
        }
        
        if (currentNode.isVisited) continue;

        currentNode.isVisited = true;
        visitedNodesInOrder.push(currentNode);

        const neighbors = getUnvisitedNeighbors(currentNode, grid);

        for (const neighbor of neighbors){
            const weight = neighbor.isWall ? 1 : 0;
            const distance = currentNode.distance + weight;

            if (!neighbor.isVisited || distance < neighbor.distance){
                neighbor.distance = distance;
                neighbor.previousNode = currentNode;
                queue.push(neighbor);
            }
        }
    }

    return visitedNodesInOrder;
}

function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const { row, col } = node;
  
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  
    return neighbors.filter((neighbor) => !neighbor.isVisited);
  }