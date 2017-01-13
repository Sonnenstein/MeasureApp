var task_start = performance.now();

// for ticks per second
var tick = 0;
var lastTime = 0.0;

var alpha = 0.0;
var beta = 0.0;
var gamma = 0.0;

var correctionX = 0.0;
var correctionY = 0.0;
var correctionZ = 0.0;

var measurementActive = false;
var data = [];

var state = -1;

const INIT = 0;
const CALIBRATE = 1;
const READY = 2;
const MEASURE = 3;
const CALCULATE = 4;

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
	startMeasurement();
}

function ready() {
	state = READY;
	alert("X: " + correctionX + " Y: " + correctionY + " Z: " + correctionZ);
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
		case CALIBRATE:
			break;
		case READY:
			break;
		case MEASURE:
			break;
		case CALCULATE:
			break;
		default: alert("Invalid state: " + state);
			break;
	}
	
	/*
	if (!measurementActive) {
		document.querySelector("#dist_acc").innerHTML = "Measuring";
		document.querySelector("#dist_acc").style.backgroundColor = 'green';
		data.length = 0;
		task_start = performance.now();
		measurementActive = true;
	} else {
		measurementActive = false;
		if (data.length > 0) {
			cX = data[0]["ax"];
			cY = data[0]["ay"];;
			cZ = data[0]["az"];;
		}
		

		document.querySelector("#dist_acc").innerHTML = "Number of Measurements: " + data.length;
		document.querySelector("#dist_acc").style.backgroundColor = 'orange';
		
		var zDistance = calculateDistance(data); 
		document.querySelector("#zdist_acc").innerHTML = "Traveled Z-distance: " + zDistance;
	}
	*/
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
		newItem["ax"] = ax;
		newItem["ay"] = ay;
		newItem["az"] = az;
		newItem["alpha"] = alpha;
		newItem["beta"] = beta;
		newItem["gamma"] = gamma;
		newItem["time"] = (performance.now() - task_start) / 1000.0;
		
		data.push(newItem);
	}
	
	if (state == CALIBRATE && data.length >= 100) {
		stopMeasurement();
		performCalibration();
	}

	var currentTime = performance.now() - task_start;
	var outTime = (Math.round(currentTime) / 1000.0);
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
	
	// measurements per second
	tick = tick + 1;
	if (currentTime - lastTime >= 1000.0) {
		lastTime = Math.floor(currentTime);
		document.querySelector("#tick_acc").innerHTML = "Ticks per Second = " + tick;
		tick = 0;
	}    
	//}
}

window.addEventListener("deviceorientation", function(event) {
	// angles in system
	alpha = event.alpha;
	beta = (event.beta + 360.0);
	gamma = -event.gamma;
}, true);

// ------------------------------------------------------------

// trial for z distance
function calculateDistance() {
    var speed = [];

	speed.push(0.0);
		
	for (var i = 1; i < data.length; i++) { // simple trapez rule
		var interval = (data[i]["time"] - data[i - 1]["time"]);
		var avgAcceleration = (data[i]["az"] + data[i - 1]["az"]) / 2.0 - correctionZ;
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

// starts measurement and clears data
function startMeasurement() {
	resetMeasurement();
	task_start = performance.now();
	measurementActive = true;
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

