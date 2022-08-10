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

function dfs(start){
	const dfsInfo = []; //Index - {dist}
	for (let i = 0; i < graph.length; i++){
		dfsInfo[i] = {
			dist:null,
			parent:null
		};
	}
	
	const stack = [];
	stack.push(start);
	dfsInfo[start].dist = 0;
	
	while (stack.length){
		var current = stack.pop();
		for (let i = 0; i < graph[current].length; i++){
			const index = graph[current][i];
			if (dfsInfo[index].dist == null){
				dfsInfo[index].dist = dfsInfo[current].dist + 1;
				dfsInfo[index].parent = current;
				stack.push(index);
				console.log(index);
			}
		}
	}
	
	return dfsInfo;
}

function getPath(dfsInfo, start, end){
	var path = [end];
	var node = dfsInfo[end];
	while (node.parent !== null){
		path.push(node.parent);			
		if (node.parent === start){
			return path.reverse();
		} else {
			node = dfsInfo[node.parent];
		}
	}
	return null;
}

const info = dfs(0);
console.log(info);

const path = getPath(info, 0, 5);
console.log(path);