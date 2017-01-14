var task_start = performance.now();
var measurement_start = performance.now();;

// for ticks per second
var tick = 0;
var lastTime = 0.0;

// last measured angles
var alpha = 0.0;
var beta = 0.0;
var gamma = 0.0;

// angles of calibration
var correctionX = 0.0;
var correctionY = 0.0;
var correctionZ = 0.0;

// defines state of system
var measurementActive = false;
var data = [];
var angles = [];
tail = 0;
const NUM_ANGLES = 10;

var state = -1;
const INIT = 0;
const CALIBRATE = 1;
const READY = 2;
const MEASURE = 3;
const CALCULATE = 4;

// for debugging 
var stop = false;

function main() {
	
	/*
	var vec = [];
	vec["x"] = -4.549;
	vec["y"] = -0.067;
	vec["z"] = -9.0884;
	vec = transformDeviceToWorld(vec, 328.57 , 360.3779,26.589);
	console.log("x: " + vec["x"] + "\n");
	console.log("y: " + vec["y"] + "\n");
	console.log("z: " + vec["z"] + "\n");
	*/
	init();
}

function init() {
	state = INIT;
	document.getElementById("actionBtn").value = "Please hold still and press button for calibration.";
}

function calibrate() {
	state = CALIBRATE;
	document.getElementById("actionBtn").value = "Now Calibrating";
	document.querySelector("#dist_acc").style.backgroundColor = 'orange';
	startNewMeasurement();
}

function ready() {
	state = READY;
	resetAngles();
	document.getElementById("actionBtn").value = "Press to start measurement.";
}

function measure() {
	state = MEASURE;
	startNewMeasurement();
	document.getElementById("actionBtn").value = "Now measuring. Press again to stop measurement.";
}

function calculate() {
	stopMeasurement();
	state = CALCULATE;
	prepareData();
	var zDistance = calculateDistance(); 
	document.querySelector("#zdist_acc").innerHTML = "Traveled Z-distance: " + zDistance;
	
	ready();
}


// ------------------------------------------------------------

function performAction() {
	/*
	stop = !stop;
	return;
	*/
	
	switch (state) {
		case INIT: calibrate();
			break;
		case CALIBRATE: document.getElementById("actionBtn").value = "Please wait";
			break;
		case READY: measure();
			break;
		case MEASURE: calculate();
			break;
		case CALCULATE: document.getElementById("actionBtn").value = "Please wait";
			break;
		default: alert("Invalid state: " + state);
			break;
	}
}

// ------------------------------------------------------------

// measurement routine
window.ondevicemotion = function(event) { 
	//if(!stop) {

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
	
	if (state == CALIBRATE && data.length >= 100) {
		stopMeasurement();
		performCalibration();
	}

	var outAx = (Math.round(ax * 10000) / 10000.0);
	var outAy = (Math.round(ay * 10000) / 10000.0);
	var outAz = (Math.round(az * 10000) / 10000.0);
	var outAlpha = (Math.round(alpha * 10000) / 10000.0);
	var outBeta = (Math.round(beta * 10000) / 10000.0);
	var outGamma = (Math.round(gamma * 10000) / 10000.0);
	
	document.querySelector("#x_acc").innerHTML = "X = " + outAx;
	document.querySelector("#y_acc").innerHTML = "Y = " + outAy;
	document.querySelector("#z_acc").innerHTML = "Z = " + outAz;
	document.querySelector("#time_acc").innerHTML = "Time = " + outTime;
	
	document.querySelector("#mag_alpha").innerHTML = "alpha = " + outAlpha;
	document.querySelector("#mag_beta").innerHTML = "beta = " + outBeta;
	document.querySelector("#mag_gamma").innerHTML = "gamma = " + outGamma;
	

	//}
}

// Stores current angles for later interpolation
window.addEventListener("deviceorientation", function(event) {
	tick = tick + 1;
	// measurements per second
	var currentTime = performance.now() - measurement_start;
	var outTime = (Math.round(currentTime) / 1000.0);
	
	if (currentTime - lastTime >= 1000.0) {
		lastTime = Math.floor(currentTime);
		document.querySelector("#tick_acc").innerHTML = "Ticks per Second = " + tick;
		tick = 0;
	}    
	

	var ang = [];
	ang["time"] = (performance.now() - task_start) / 1000;
	
	// angles in system
	alpha = event.alpha;
	beta = (event.beta + 360.0);
	gamma = -event.gamma;
	
	ang["alpha"] = alpha;
	ang["beta"] = beta;
	ang["gamma"] = gamma;

	if (state != CALCULATE) {
		if (measurementActive || (angles.length <= NUM_ANGLES))  {
			angles.push(ang);
		} else if (tail > 0) {
			angles.push(ang);
			tail = tail - 1;
		} else {
			angles.shift();
			angles.push(ang);
		}
	}
	
}, true);

// ------------------------------------------------------------

// Transforms measurements into world space and corrects them according to calibration
function prepareData() {
	for (var i = 0; i < data.length; i++) {
		
		// get relating angles for acceleration
		
		
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
		
		// normalize time
		data[i]["time"] = data[i]["time"] - data[0]["time"];
	}
}

// trial for z distance
function calculateDistance() {
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
	
	return dist;
}

// performs calibration based on measured data
function performCalibration() {
	// prepareData();
	
	var sum_x = 0.0;
	var sum_y = 0.0;
	var sum_z = 0.0;
	var sum_alpha = 0.0;
	var sum_beta = 0.0;
	var sum_gamma = 0.0;
	
	for (var i = 0; i < data.length; i++) {
		sum_x += data[i]["ax"];
		sum_y += data[i]["ay"];
		sum_z += data[i]["az"];
		sum_alpha += data[i]["alpha"];
		sum_beta += data[i]["beta"];
		sum_gamma += data[i]["gamma"];
	}
		
	var vec = [];
	vec["x"] = sum_x / data.length;
	vec["y"] = sum_y / data.length;
	vec["z"] = sum_z / data.length;
	
	var angleAlpha = (sum_alpha / data.length);
	var angleBeta = (sum_beta / data.length);
	var angleGamma = (sum_gamma / data.length);
	
	vec = transformDeviceToWorld(vec, angleAlpha, angleBeta, angleGamma);
	
	correctionX = vec["x"];
	correctionY = vec["y"];
	correctionZ = vec["z"];
	
	ready();
}

// ------------------------------------------------------------

// folds the data with a gaussian distribution to derive acurate angles
function foldGaussian(arr, sigma, rel_points) {
	
}


// starts measurement and clears data
function startNewMeasurement() {
	measurement_start = performance.now();
	resetMeasurement();
	measurementActive = true;
	tail = 10;
}

// stops measurement and clears data
function resetMeasurement() {
	stopMeasurement();
	data.length = 0;
}

// stop measurements
function stopMeasurement() {
	measurementActive = false;
}

// resets angles
function resetAngles() {
	angles.length = 0;
}
