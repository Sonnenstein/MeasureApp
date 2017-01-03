var clock = 0;
var task_start = performance.now();
var tick = 0;
var lastTime = 0;
document.querySelector("#dist_acc").innerHTML = "Unbalanced";

function startMeasurement() {
	
	var rotation = eventData.rotationRate;
	var alpha = rotation.alpha;
	var beta = rotation.beta;
	var gamma = rotation.gamma;

	beta = 0.0;
	gamma = 0.0;
	
	if (Math.abs(beta) < 2.0 && Math.abs(gamma) < 2.0) {
		document.querySelector("#dist_acc").innerHTML = "Balanced";
		document.querySelector("#dist_acc").text-color = "green";
	}
}


window.ondevicemotion = function(event) { 

	var ax = event.accelerationIncludingGravity.x;
	var ay = event.accelerationIncludingGravity.y;
	var az = event.accelerationIncludingGravity.z;

	
	var rotation = eventData.rotationRate;
	var alpha = rotation.alpha;
	var beta = rotation.beta;
	var gamma = rotation.gamma;

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




