/*
* AJ Savino
*/
//Works with gl-matrix
var MathUtils = {
	toDegrees:function(radians){
		return radians * 180 / Math.PI;
	},
	
	toRadians:function(degrees){
		return degrees * Math.PI / 180;
	},
	
	distanceBetween:function(vec1, vec2){
		return Math.sqrt(Math.abs(vec1[0] - vec2[0]) + Math.abs(vec1[1] - vec2[1]));
	},
	
	angleBetween:function(vec1, vec2){
		return MathUtils.toDegrees(Math.atan2(vec2[1] - vec1[1], vec2[0] - vec1[0]));
	},
	
	dotProduct:function(vec1, vec2){
		return vec1[0] * vec2[0] + vec1[1] * vec2[1];
	},
	
	vectorFromPolar:function(degrees, magnitude){
		if (typeof magnitude === typeof undefined){
			magnitude = 1;
		}
		var x = Math.sin(MathUtils.toRadians(90 - degrees)) * magnitude;
		var y = Math.sin(MathUtils.toRadians(degrees)) * magnitude;
		var vec = vec2.create();
		vec2.set(vec, x, y);
		return vec;
	},
	
	coterminal:function(value, max){
		if (typeof max === typeof undefined){
			max = 360;
		}
		return ((value %= max) >= 0) ? value : value + max;
	},
	
	halfAngle:function(degrees){
		degrees = MathUtils.coterminal(degrees);
		if (degrees <= 360 && degrees > 180){
			degrees -= 360;
		}
		return degrees;
	}
};