class PriorityQueue {
	constructor(){
		this.items = [];
	}
	isEmpty(){
		return this.items.length === 0;
	}
	enqueue(node){
		//Push node into approparite place in queue
		for (var i = 0; i < this.items.length; i++){
			if (node.dist < this.items[i].dist){
				this.items.splice(i, 0, node);
				break;
			}
		}
		if (i === this.items.length){
			this.items.push(node);
		}
	}
	dequeue(){
		return this.items.shift();
	}
	toString(){
		return this.items.toString();
	}
}

const graph = [
	[
		{to:1, weight:2},
		{to:3, weight:1}
	],
	[
		{to:3, weight:3},
		{to:4, weight:10}
	],
	[
		{to:0, weight:4},
		{to:5, weight:5}
	],
	[
		{to:2, weight:2},
		{to:4, weight:2},
		{to:5, weight:8},
		{to:6, weight:4}
	],
	[
		{to:6, weight:6}
	],
	[],
	[
		{to:5, weight:1}
	],
];

function dijkstras(graph, start){
	const info = new Array(graph.length); //{dist:fromStart, prev:index}
	for (var i = 0; i < info.length; i++){
		info[i] = {
			dist:Infinity,
			prev:-1
		};
	}
	info[start].dist = 0;
	
	const pq = new PriorityQueue();
	pq.enqueue({
		index:start,
		dist:0
	});
	
	while (!pq.isEmpty()){
		//console.log(pq);
		const node = pq.dequeue();
		const paths = graph[node.index];
		for (var i = 0; i < paths.length; i++){
			const path = paths[i];
			const dist = info[node.index].dist + path.weight;
			if (dist < info[path.to].dist){
				info[path.to].dist = dist;
				info[path.to].prev = node.index;
				pq.enqueue({
					index:path.to,
					dist:dist
				});
			} 
		}
	}
	
	return info;
}

function getPath(info, start, end){
	var path = [end];
	var node = info[end];
	while (node.prev !== -1){
		path.push(node.prev);
		node = info[node.prev];
	}
	path.reverse();
	return path;
}

const info = dijkstras(graph, 0);
console.log(info);

const path = getPath(info, 0, 5);
console.log(path);