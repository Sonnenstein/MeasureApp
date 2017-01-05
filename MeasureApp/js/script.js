var task_start = performance.now();
var tick = 0;
var lastTime = 0.0;

var alpha = 0.0;
var beta = 0.0;
var gamma = 0.0;

var cX = 0.0;
var cY = 0.0;
var cZ = 0.0;

var measurementActive = false;
var data = [];

function startMeasurement() {

	if (!measurementActive) {
		// if (Math.abs(beta) < 2.0 && Math.abs(gamma) < 2.0) {
			document.querySelector("#dist_acc").innerHTML = "Measuring";
			document.querySelector("#dist_acc").style.backgroundColor = 'green';
			data.length = 0;
			task_start = performance.now();
			measurementActive = true;
		// }
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
}


// measurement routine
window.ondevicemotion = function(event) { 

	var ax = event.accelerationIncludingGravity.x;
	var ay = event.accelerationIncludingGravity.y;
	var az = event.accelerationIncludingGravity.z;
	
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

	var currentTime = performance.now() - task_start;
	var outTime = (Math.round(currentTime) / 1000.0);
	var outAx = (Math.round(ax * 1000) / 1000.0);
	var outAy = (Math.round(ay * 1000) / 1000.0);
	var outAz = (Math.round(az * 1000) / 1000.0);
	var outAlpha = (Math.round(alpha * 1000) / 1000.0);
	var outBeta = (Math.round(beta * 1000) / 1000.0);
	var outGamma = (Math.round(gamma * 1000) / 1000.0);
	
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
}

window.addEventListener("deviceorientation", function(event) {
	alpha = event.alpha;
	beta = event.beta;
	gamma = event.gamma;
}, true);


// trial for z distance
function calculateDistance(data) {
    var speed = [];

	speed.push(0.0);
		
	for (var i = 1; i < data.length; i++) { // simple trapez rule
		var interval = (data[i]["time"] - data[i - 1]["time"]);
		var avgAcceleration = (data[i]["az"] + data[i - 1]["az"]) / 2.0 - cZ;
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



