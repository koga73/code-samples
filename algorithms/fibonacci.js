function memoize(func){
	const memo = {};
	return function(...args){
		const key = JSON.stringify(args);
		if (key in memo){
			console.log("FROM MEMO");
			return memo[key];
		} else {
			console.log("COMPUTE");
			const result = func(...args);
			memo[key] = result;
			return result;
		}
	}
}

//Recursive
/*
console.log("Recursize");
function fib(n){
	if (n == 1 || n === 2){
		return 1;
	}
	return fib(n - 1) + fib(n - 2);
});
*/

//Recursive + Memo
/*
console.log("Recursize + Memo");
const fib = memoize(function(n){
	if (n == 1 || n === 2){
		return 1;
	}
	return fib(n - 1) + fib(n - 2);
});
*/

//Bottom up
console.log("Bottom up");
function fib(n){
	const vals = [0,1,1];
	for (var i = 3; i < n + 1; i++){
		vals[i] = vals[i - 1] + vals[i - 2];
	}
	return vals[n];
}

console.log(fib(5));
console.log(fib(10));

//1,1,2,3,5,8,13,21