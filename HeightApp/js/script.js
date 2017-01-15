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

// system calibration
var correctionX = 0.0;
var correctionY = 0.0;
var correctionZ = 0.0;

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
		
		// enough data for calibration
		if (state == CALIBRATE && data.length >= 100) {
			stopMeasurement();
			performCalibration();
		}
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


// Measurement control
// -------------------------------------------------------------------------
// starts measurement and clears data
function startNewMeasurement() {
	measurementActive = false;
	data.length = 0;
	measurementActive = true;
}

// stops measurement and clears data
function resetMeasurement() {
	measurementActive = false;
	data.length = 0;
}

// stop measurements
function stopMeasurement() {
	measurementActive = false;
}

// Calibration and data preparation
// -------------------------------------------------------------------------
// performs calibration based on measured data
function performCalibration() {
	prepareData();
	var sum_x = 0.0;
	var sum_y = 0.0;
	var sum_z = 0.0;

	for (var i = 0; i < data.length; i++) {
		sum_x += data[i]["ax"];
		sum_y += data[i]["ay"];
		sum_z += data[i]["az"];
	}
		
	correctionX = sum_x / data.length;
	correctionY = sum_y / data.length;
	correctionZ = sum_z / data.length;
	
	var outAx = (Math.round(correctionX * 10000) / 10000.0);
	var outAy = (Math.round(correctionY * 10000) / 10000.0);
	var outAz = (Math.round(correctionZ * 10000) / 10000.0);
	
	document.querySelector("#x_cal").innerHTML = "X: " + outAx + " m/s";
	document.querySelector("#y_cal").innerHTML = "Y: " + outAy + " m/s";
	document.querySelector("#z_cal").innerHTML = "Z: " + outAz + " m/s";
	
	ready();
}

// Transforms measurements into world space and corrects them according to calibration
function prepareData() {
	for (var i = 0; i < data.length; i++) {
		
		// transform into world space
		var vec = [];
		vec["x"] = data[i]["ax"];
		vec["y"] = data[i]["ay"];
		vec["z"] = data[i]["az"]
		vec = transformDeviceToWorld(vec, data[i]["alpha"], data[i]["beta"], data[i]["gamma"]);

		// calibrate
		if (state != CALIBRATE) {
			data[i]["ax"] = vec["x"] - correctionX;
			data[i]["ay"] = vec["y"] - correctionY;
			data[i]["az"] = vec["z"] - correctionZ;
		} else { // state == CALIBRATE
			data[i]["ax"] = vec["x"];
			data[i]["ay"] = vec["y"];
			data[i]["az"] = vec["z"];
		}
	}
}

// height calculation
// -------------------------------------------------------------------------
function calculateDistance() {
	prepareData();
    var speed = [];
	speed.push(0.0);
	
	for (var i = 1; i < data.length; i++) { // simple trapez rule
		var interval = (data[i]["time"] - data[i - 1]["time"]);
		var avgAcceleration = (data[i]["az"] + data[i - 1]["az"]) / 2.0;
		var newSpeed = speed[i - 1] + avgAcceleration * interval;
		speed.push(newSpeed);
	}             

	var dist = 0.0;
	for (var i = 1; i < speed.length; i++) {
		var interval = (data[i]["time"] - data[i - 1]["time"]);
		var avgSpeed = (speed[i - 1] + speed[i]) / 2.0;
		dist = dist + avgSpeed * interval;
	}
	
	document.querySelector("#measuredHeight").innerHTML = "Traveled Z-distance: " + dist + " m";
	ready();
}