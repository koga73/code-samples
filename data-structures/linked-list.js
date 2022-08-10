class LinkedList {
	constructor(value, next){
		this.value = value || 0;
		this.next = next || null;
	}
	toString(){
		var str = this.value;
		if (this.next){
			str += " | " + this.next.toString();
		}
		return str;
	}
}

const values = [9,2,3,6,2,7,4,8,5];
var root = null;
var current = null;
for (var i = 0; i < values.length; i++){
	var node = new LinkedList(values[i]);
	if (!root){
		root = node;
	} else {
		current.next = node;
	}
	current = node;
}

function reverseLinkedList(root){
	var node = null;
	var previous = null;
	var current = root;
	while (current){
		node = new LinkedList(current.value);
		if (previous){
			node.next = previous;
		}
		previous = node;
		current = current.next;
	}
	return node;
}

console.log(root.toString());
console.log(reverseLinkedList(root).toString());