const COUNT = 10;
const MAX = 99;

function Node(value){
	this.value = value;
	this.parent = null;
	this.left = null;
	this.right = null;
}
Node.prototype.insert = function(node){
	if (node.value < this.value){
		if (this.left){
			this.left.insert(node);
		} else {
			this.left = node;
			node.parent = this.left;
		}
	}
	if (node.value > this.value){
		if (this.right){
			this.right.insert(node);
		} else {
			this.right = node;
			node.parent = this.right;
		}
	}
}
Node.prototype.remove = function(val){
	if (!val){
		return;
	}
	if (val < this.value){
		if (this.left){
			this.left.remove(val);
		}
	} else if (val > this.value){
		if (this.right){
			this.right.remove(val);
		}
	} else if (this.left && this.right){
		console.log("A");
		var minNode = this.right.min();
		if (this.parent.left === this){
			this.parent.left = minNode;
			minNode.right = this.right;
		} else if (this.parent.right === this){
			this.parent.right = minNode;
			minNode.right = this.right;
		}
		minNode.parent = this.parent;
		this.parent = null;
	} else if (this.left){
		console.log("B");
		if (this.parent.left === this){
			this.parent.left = this.left;
			this.left.parent = this.parent;
		} else if (this.parent.right === this){
			this.parent.right = this.left;
			this.left.parent = this.parent;
		}
		this.parent = null;
	} else if (this.right){
		console.log("C");
		if (this.parent.left === this){
			this.parent.left = this.right;
			this.right.parent = this.parent;
		} else if (this.parent.right === this){
			this.parent.right = this.right;
			this.right.parent = this.parent;
		}
		this.parent = null;
	}
}
Node.prototype.min = function(){
	return this.left ? this.left.min() : this;
}
Node.prototype.max = function(){
	return this.right ? this.right.max() : this;
}
Node.prototype.maxDepth = function(){
	const leftDepth = this.left ? this.left.maxDepth() + 1 : 0;
	const rightDepth = this.right ? this.right.maxDepth() + 1 : 0;
	return Math.max(leftDepth, rightDepth);
}
Node.prototype.simplify = function(){
	return {
		value:this.value,
		left:this.left ? this.left.simplify() : null,
		right:this.right ? this.right.simplify() : null
	};
}
Node.prototype.toString = function(){
	return JSON.stringify(this.simplify(), null, 4);
}
Node.prototype.search = function(value){
	if (this.value === value){
		return this;
	}
	if (this.left && value < this.value){
		return this.left.search(value);
	}
	if (this.right && value > this.value){
		return this.right.search(value);
	}
	return null;
}


var root = null;
var removeNode = null;
const vals = [6, 2, 8, 1, 5, 3, 4];
for (let i = 0; i < vals.length; i++){
	const val = vals[i];
	const node = new Node(val);
	if (!root){
		root = node;
	} else {
		root.insert(node);
	}
}
console.log(root.toString());
var found = root.search(3);
console.log(found.toString());

/*const root = new Node(randomInt());
for (var i = 0; i < COUNT; i++){
	root.insert(new Node(randomInt()));
}
console.log(root.toString());
function randomInt(){
	return Math.floor(Math.random() * MAX);
}*/