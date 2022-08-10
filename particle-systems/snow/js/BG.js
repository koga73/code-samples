/*
* AJ Savino
*/
(function(){
	var BG = {
		FPS:60, //Used when requestAnimationFrame doesn't exist
		RESIZE_TIMEOUT:250,
		
		MIN_RES:1024*768, //Used to determine number of circles
		MAX_RES:1920*1080, //Used to determine number of circles
		MIN_CIRCLES:130, //MIN_RES
		MAX_CIRCLES:330, //MAX_RES
		MIN_RADIUS:4,
		MAX_RADIUS:18,
		MIN_SPEED:50,
		MAX_SPEED:200,
		MIN_ALPHA:0.1,
		MAX_ALPHA:0.7,
		COLOR:0xFFFFFF,
		HUE_VARIANCE:0x08, //0x00-0xFF
		BLUR_STEPS:3,
		
		MODE_RANDOM:"random",
		MODE_DRIFT:"drift",
		MODE:"drift",
		
		canvas:null,
		context:null,
		resizeTimeout:null,
		renderTimer:null,
		normalTimer:null,
		circles:[],
		circlesLen:0,
		paused:false,
		
		init:function(){
			var canvas;
			try {
				canvas = document.createElement("canvas");
				canvas.setAttribute("class", "bg-gl-canvas");
				canvas.setAttribute("style", "position:fixed;top:0;left:0;width:100%;height:100%;");
				var body = document.getElementsByTagName("body")[0];
				body.insertBefore(canvas, body.firstChild);
				BG.canvas = canvas;
			
				BG.context = canvas.getContext("2d");
				if (!BG.context){
					throw "Context '2d' could not be created. Ensure that this feature is supported by your browser.";
				}
			} catch (ex){
				return;
			}
			
			var resizeEvent = "resize";
			if ("onorientationchange" in window){
				resizeEvent = "orientationchange";
			}
			if (window.addEventListener){
				window.addEventListener(resizeEvent, BG.handler_resize, false);
			} else if (window.attachEvent){
				window.attachEvent("on" + resizeEvent, BG.handler_resize);
			}
			BG.resize();
			
			var res = Math.max(Math.min(canvas.width * canvas.height, BG.MAX_RES), BG.MIN_RES);
			var resScale = (res - BG.MIN_RES) / (BG.MAX_RES - BG.MIN_RES);
			var circlesLen = resScale * (BG.MAX_CIRCLES - BG.MIN_CIRCLES) + BG.MIN_CIRCLES;
			for (var i = 0; i < circlesLen; i++){
				BG.generateCircle();
			}
			BG.circlesLen = circlesLen;
			
			BG.normalTimer = new NormalTimer();
			if ("requestAnimationFrame" in window){
				requestAnimationFrame(BG.render);
			} else {
				BG.renderTimer = setInterval(BG.render, 1000 / BG.FPS);
			}
		},
		
		generateCircle:function(x, y){
			if (typeof x === typeof undefined){
				x = Math.random() * BG.canvas.width;
			}
			if (typeof y === typeof undefined){
				y = Math.random() * BG.canvas.height;
			}
			var circle = new Circle();
			circle.xy[0] = x;
			circle.xy[1] = y;
			circle.radius = Math.random() * (BG.MAX_RADIUS - BG.MIN_RADIUS) + BG.MIN_RADIUS;
			circle.alpha = Math.random() * (BG.MAX_ALPHA - BG.MIN_ALPHA) + BG.MIN_ALPHA;
			
			var color = BG.COLOR
			var r = ((BG.COLOR >> 16) & 0xFF);
			var g = ((BG.COLOR >> 8) & 0xFF);
			var b = ((BG.COLOR >> 0) & 0xFF);
			r ^= (Math.random() * BG.HUE_VARIANCE) >> 0;
			g ^= (Math.random() * BG.HUE_VARIANCE) >> 0;
			b ^= (Math.random() * BG.HUE_VARIANCE) >> 0;
			color = (r << 16) | (g << 8) | (b << 0);
			color = "#" + color.toString(16);
			circle.color = color;
			
			var moveAngle;
			switch (BG.MODE){
				case BG.MODE_RANDOM:
					moveAngle = Math.random() * (Math.PI << 1);
					break;
				case BG.MODE_DRIFT:
					moveAngle = (Math.random() * (Math.PI * 0.5)) + (Math.PI * 0.25); //50% of 180°
					break;
			}
			var moveSpeed = Math.random() * (BG.MAX_SPEED - BG.MIN_SPEED) + BG.MIN_SPEED;
			circle.moveVec = [
				Math.sin(Math.PI * 0.5 - moveAngle) * moveSpeed,
				Math.sin(moveAngle) * moveSpeed
			];
			
			BG.circles.push(circle);
		},
		
		render:function(){
			var delta = BG.normalTimer.tick();
			if (!BG.paused && delta < 1){ //As to not "jump" when returning to page
				var context = BG.context;
				var canvasWidth = BG.canvas.width;
				var canvasHeight = BG.canvas.height;
				context.clearRect(0, 0, canvasWidth, canvasHeight);
				
				var circlesLen = BG.circlesLen;
				for (var i = 0; i < circlesLen; i++){
					var circle = BG.circles[i];
					var circleXY = circle.xy;
					var circleMoveVec = circle.moveVec;
					var newX = circleXY[0] + circleMoveVec[0] * delta;
					var newY = circleXY[1] + circleMoveVec[1] * delta;
					var diameter = circle.radius << 1;
					switch (BG.MODE){
						case BG.MODE_RANDOM:
							if (newX < -diameter || newX > canvasWidth + diameter){
								circleMoveVec[0] *= -1;
							} else {
								circleXY[0] = newX;
							}
							if (newY < -diameter || newY > canvasHeight + diameter){
								circleMoveVec[1] *= -1;
							} else {
								circleXY[1] = newY;
							}
							break;
						case BG.MODE_DRIFT:
							if (newX < -diameter){
								circleXY[0] = canvasWidth + diameter;
							} else if (newX > canvasWidth + diameter){
								circleXY[0] = -diameter;
							} else {
								circleXY[0] = newX;
							}
							if (newY < -diameter){
								circleMoveVec.y *= -1;
							} else if (newY > canvasHeight + diameter){
								circleXY[1] = -diameter;
							} else {
								circleXY[1] = newY;
							}
							break;
					}
					BG.renderCircle(circle);
				}
			}
			if (!BG.renderTimer){
				requestAnimationFrame(BG.render);
			}
		},
		
		renderCircle:function(circle){
			var circleXY = circle.xy;
			var circleAlpha = circle.alpha / BG.BLUR_STEPS;
			var context = BG.context;
			context.save();
			context.fillStyle = circle.color;
			context.globalAlpha = circleAlpha;
			for (var i = 1; i <= BG.BLUR_STEPS; i++){
				context.beginPath();
				context.arc(circleXY[0], circleXY[1], circle.radius + BG.BLUR_STEPS - i, 0, Math.PI << 1);
				context.fill();
				context.closePath();
			}
			context.restore();
		},
		
		resize:function(){
			var oldWidth = BG.canvas.width;
			var oldHeight = BG.canvas.height;
			var newWidth = BG.canvas.clientWidth;
			var newHeight = BG.canvas.clientHeight;
			
			BG.canvas.width = newWidth;
			BG.canvas.height = newHeight;
			
			var circlesLen = BG.circlesLen;
			for (var i = 0; i < circlesLen; i++){
				var circle = BG.circles[i];
				circle.xy[0] = newWidth * circle.xy[0] / oldWidth;
				circle.xy[1] = newHeight * circle.xy[1] / oldHeight;
			}
		},
		
		handler_resize:function(){
			if (BG.resizeTimeout){
				clearTimeout(BG.resizeTimeout);
				BG.resizeTimeout = null;
			}
			BG.resizeTimeout = setTimeout(function(){
				clearTimeout(BG.resizeTimeout);
				BG.resizeTimeout = null;
				BG.resize();
			}, BG.RESIZE_TIMEOUT);
		},
		
		pause:function(){
			BG.paused = true;
		},
		
		resume:function(){
			BG.paused = false;
		}
	};
	
	var Circle = function(){
		return {
			xy:[0,0],
			radius:64,
			color:"#FFFFFF",
			alpha:1,
			moveVec:null
		};
	};
	
	var NormalTimer = function(){
		var _vars = {
			_elapsed:0,
			_delta:0,
			_lastTime:0,
			_startTime:new Date().getTime()
		};
		_vars._lastTime = _vars._startTime;
		
		var _methods = {
			elapsed:function(){ //Getter
				return _vars._elapsed;
			},
			
			delta:function(){ //Getter
				return _vars._delta;
			},
			
			tick:function(){
				var currentTime = new Date().getTime();
				_vars._elapsed = (currentTime - _vars._startTime) * 0.001;
				_vars._delta = (currentTime - _vars._lastTime) * 0.001;
				_vars._lastTime = currentTime;
				return _vars._delta;
			}
		};
		
		return {
			elapsed:_methods.elapsed,
			delta:_methods.delta,
			tick:_methods.tick
		};
	};
	
	BG.init();
	
	//Expose public
	this.BG = BG;
})();