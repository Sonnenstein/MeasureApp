// for time anotation
var task_start = performance.now();

// for measurements per second
var tick_acc = 0;
var tick_mag = 0;
var lastTime = task_start;



// for measurement routine
var measurementActive = false;
var data = [];

// last measured angles
var alpha = 0.0;
var beta = 0.0;
var gamma = 0.0;

// measurement routine
// -------------------------------------------------------------------------
// acceleration
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
		newItem["alpha"] = alpha;
		newItem["beta"] = beta;
		newItem["gamma"] = gamma;
		data.push(newItem);
	}

	var outAx = (Math.round(ax * 10000) / 10000.0);
	var outAy = (Math.round(ay * 10000) / 10000.0);
	var outAz = (Math.round(az * 10000) / 10000.0);
	
	document.querySelector("#x_acc").innerHTML = "X: " + outAx + " m/s";
	document.querySelector("#y_acc").innerHTML = "Y: " + outAy + " m/s";
	document.querySelector("#z_acc").innerHTML = "Z: " + outAz + " m/s";
		
	tick_acc = tick_acc + 1;
		
	var currentTime = performance.now();
	if (currentTime - lastTime >= 1000.0) {
		lastTime = currentTime;
		document.querySelector("#rate_acc").innerHTML = "Measurements per Second: " + tick_acc;
		document.querySelector("#rate_mag").innerHTML = "Measurements per Second: " + tick_mag;

		tick_acc = 0;
		tick_mag = 0;
	}    
}

// angles
window.addEventListener("deviceorientation", function(event) {
	tick_mag = tick_mag + 1;
	
	alpha = event.alpha;
	beta = event.beta;
	gamma = -event.gamma;
	
	var outAlpha = (Math.round(alpha * 10000) / 10000.0);
	var outBeta = (Math.round(beta * 10000) / 10000.0);
	var outGamma = (Math.round(gamma * 10000) / 10000.0);
	
	document.querySelector("#mag_alpha").innerHTML = "Alpha: " + outAlpha + "°";
	document.querySelector("#mag_beta").innerHTML = "Beta: " + outBeta + "°";
	document.querySelector("#mag_gamma").innerHTML = "Gamma: " + outGamma + "°";	
}, true);
// -------------------------------------------------------------------------
