var time = 0.0;
var task_start = 0.0;
var tick = 0;
var lastTime = 0.0;

var alpha = 0.0;
var beta = 0.0;
var gamma = 0.0;

var measurementActive = false;
var data = [];

function startMeasurement() {

	if (!measurementActive) {
		if (Math.abs(beta) < 2.0 && Math.abs(gamma) < 2.0) {
			document.querySelector("#dist_acc").innerHTML = "Measuring";
			document.querySelector("#dist_acc").style.backgroundColor = 'green';
			data.length = 0;
			task_start = 0.0;
			measurementActive = true;
		}
	} else {
		document.querySelector("#dist_acc").innerHTML = "Measurements: " + data.length;
		document.querySelector("#dist_acc").style.backgroundColor = 'orange';
		measurementActive = false;
		
	}
}


window.ondevicemotion = function(event) { 
	var accelerationIncludingGravity = event.accelerationIncludingGravity;
	var ax = accelerationIncludingGravity.x;
	var ay = accelerationIncludingGravity.y;
	var az = accelerationIncludingGravity.z;
	
	var rotation = event.rotationRate;
	var alpha = rotation.alpha;
	var beta = rotation.beta;
	var gamma = rotation.gamma;
	
	
	// record data
	if(measurementActive) {
		if (task_start = 0) {
			task_start = performance.now();
		}
	
		var newItem = [];
		newItem["ax"] = ax;
		newItem["ay"] = ay;
		newItem["az"] = az;
		newItem["alpha"] = alpha;
		newItem["beta"] = beta;
		newItem["gamma"] = gamma;
		newItem["time"] = performance.now() - task_start;
		
		data.push(newItem);
	}

	
	document.querySelector("#x_acc").innerHTML = "X = " + ax;
	document.querySelector("#y_acc").innerHTML = "Y = " + ay;
	document.querySelector("#z_acc").innerHTML = "Z = " + az;
	document.querySelector("#time_acc").innerHTML = "Time = " + time;
	
	// measurements per second
	tick = tick + 1;
	if (time - lastTime >= 1000.0) {
		lastTime = Math.floor(time);
		document.querySelector("#tick_acc").innerHTML = "Ticks per Second = " + tick;
		tick = 0;
	}    
}

window.addEventListener("deviceorientation", function(event) {
	document.querySelector("#mag_alpha").innerHTML = "alpha = " + event.alpha;
	document.querySelector("#mag_beta").innerHTML = "beta = " + event.beta;
	document.querySelector("#mag_gamma").innerHTML = "gamma = " + event.gamma;
}, true);





