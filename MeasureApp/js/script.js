var clock = 0.0;
var task_start = performance.now();
var tick = 0;
var lastTime = 0.0;

var alpha = 0.0;
var beta = 0.0;
var gamma = 0.0;

function startMeasurement() {

	if (Math.abs(beta) < 2.0 && Math.abs(gamma) < 2.0) {
		document.querySelector("#dist_acc").innerHTML = "Balanced";
		document.querySelector("#dist_acc").style.backgroundColor = 'green';
	}
}


window.ondevicemotion = function(event) { 
	var accelerationIncludingGravity = event.accelerationIncludingGravity;
	var ax = accelerationIncludingGravity.x;
	var ay = accelerationIncludingGravity.y;
	var az = accelerationIncludingGravity.z;
	
	var rotation = event.rotationRate;
	alpha = rotation.alpha;
	beta = rotation.beta;
	gamma = rotation.gamma;
	
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





