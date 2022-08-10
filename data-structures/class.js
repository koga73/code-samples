class Shape {
	constructor(name, width, height){
		this.name = name;
		this.width = width;
		this.height = height;
	}
	getArea(){
		//Virtual
	}
	toString(){
		return `${this.name}: width:${this.width} height:${this.height}`;
	}
}

class Triangle extends Shape {
	constructor(width, height){
		super("triangle", width, height);
	}
	getArea(){
		return this.width * this.height * 0.5;
	}
}

class Rectangle extends Shape {
	constructor(width, height){
		super("rectangle", width, height);
	}
	getArea(){
		return this.width * this.height;
	}
}

var rect = new Rectangle(10, 20);
console.log(rect.toString(), rect.getArea());


var tri = new Triangle(10, 20);
console.log(tri.toString(), tri.getArea());