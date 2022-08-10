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

const sum = memoize(function(a, b){
	return a + b;
});

console.log(sum(3,4));
console.log(sum(3,4));