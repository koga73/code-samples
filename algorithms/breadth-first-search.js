const graph = [
	[1,3],
	[3,4],
	[0,5],
	[2,5,6,7],
	[6],
	[],
	[5],
	[2,4]
];

function bfs(start){
	const bfsInfo = []; //Index - {dist}
	for (let i = 0; i < graph.length; i++){
		bfsInfo[i] = {
			dist:null,
			parent:null
		};
	}
	
	const queue = [];
	queue.push(start);
	bfsInfo[start].dist = 0;
	
	while (queue.length){
		var current = queue.shift();
		for (let i = 0; i < graph[current].length; i++){
			const index = graph[current][i];
			if (bfsInfo[index].dist == null){
				bfsInfo[index].dist = bfsInfo[current].dist + 1;
				bfsInfo[index].parent = current;
				queue.push(index);
				console.log(index);
			}
		}
	}
	
	return bfsInfo;
}

function getPath(bfsInfo, start, end){
	var path = [end];
	var node = bfsInfo[end];
	while (node.parent !== null){
		path.push(node.parent);			
		if (node.parent === start){
			return path.reverse();
		} else {
			node = bfsInfo[node.parent];
		}
	}
	return null;
}

const info = bfs(0);
console.log(info);

const path = getPath(info, 0, 5);
console.log(path);