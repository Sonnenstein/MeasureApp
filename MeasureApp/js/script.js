var clock = 0;
var task_start = performance.now();
var tick = 0;
var lastTime = 0;

window.ondevicemotion = function(event) { 
	var ax = event.accelerationIncludingGravity.x;
	var ay = event.accelerationIncludingGravity.y;
	var az = event.accelerationIncludingGravity.z;

	
	clock = performance.now() - task_start;
	
	tick = tick + 1;
	
	
	document.querySelector("#x_acc").innerHTML = "X = " + ax;
	document.querySelector("#y_acc").innerHTML = "Y = " + ay;
	document.querySelector("#z_acc").innerHTML = "Z = " + az;
	document.querySelector("#clock_acc").innerHTML = "Clock = " + clock;
	if (clock - lastTime >= 1000.0) {
		lastTime = Math.floor(clock);
		document.querySelector("#tick_acc").innerHTML = "Ticks per Second = " + tick;
		tick = 0;
	}
}

window.addEventListener("deviceorientation", function(event) {
	document.querySelector("#mag_alpha").innerHTML = "alpha = " + event.alpha;
	document.querySelector("#mag_beta").innerHTML = "beta = " + event.beta;
	document.querySelector("#mag_gamma").innerHTML = "gamma = " + event.gamma;
}, true);

