// for time anotation
var task_start = performance.now();

// for measurements per second
var tick_acc = 0;
var tick_mag = 0;
var lastTime = 0.0;


// for measurement routine
var measurementActive = false;
var data = [];
var angles = [];


// measurement routine
window.ondevicemotion = function(event) { 
	var ax = -event.accelerationIncludingGravity.x;
	var ay = -event.accelerationIncludingGravity.y;
	var az = -event.accelerationIncludingGravity.z;
	
	if(measurementActive) { // record data
		var newItem = [];
		newItem["time"] = (performance.now() - task_start) / 1000.0;
		newItem["ax"] = ax;
		newItem["ay"] = ay;
		newItem["az"] = az;
		data.push(newItem);
	}

	var outAx = (Math.round(ax * 10000) / 10000.0);
	var outAy = (Math.round(ay * 10000) / 10000.0);
	var outAz = (Math.round(az * 10000) / 10000.0);
	
	document.querySelector("#x_acc").innerHTML = "X: " + outAx + " m/s";
	document.querySelector("#y_acc").innerHTML = "Y: " + outAy + " m/s";
	document.querySelector("#z_acc").innerHTML = "Z: " + outAz + " m/s";
		
	var currentTime = performance.now() - measurement_start;
	if (currentTime - lastTime >= 1000.0) {
		lastTime = Math.floor(currentTime);
		document.querySelector("#rate_acc").innerHTML = "Measurements per Second: " + tick_acc;
		document.querySelector("#rate_mag").innerHTML = "Measurements per Second: " + tick_mag;

		tick_acc = 0;
		tick_mag = 0;
	}    
}
