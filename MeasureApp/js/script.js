var time = 0.0;
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
		if (Math.abs(beta) < 2.0 && Math.abs(gamma) < 2.0) {
			document.querySelector("#dist_acc").innerHTML = "Measuring";
			document.querySelector("#dist_acc").style.backgroundColor = 'green';
			data.length = 0;
			task_start = -1.0;
			measurementActive = true;
		}
	} else {
		measurementActive = false;

		/*
		// Test data
		for(var i = 0; i < 5; i++) {
			var newItem = [];
			newItem["ax"] = 1.0;
			newItem["ay"] = 1.0;
			newItem["az"] = 1.0;
			newItem["alpha"] = 0;
			newItem["beta"] = 0;
			newItem["gamma"] = 0;
			newItem["time"] = i;
			
			data.push(newItem);
		}
		*/
		
		document.querySelector("#dist_acc").innerHTML = "Number of Measurements: " + data.length;
		document.querySelector("#dist_acc").style.backgroundColor = 'orange';
		
		var zDistance = calculateDistance(data); 
		document.querySelector("#zdist_acc").innerHTML = "Traveled Z-distance: " + zDistance;
	}
}


// measurement routine
window.ondevicemotion = function(event) { 
	var accelerationIncludingGravity = event.accelerationIncludingGravity;
	var ax = accelerationIncludingGravity.x;
	var ay = accelerationIncludingGravity.y;
	var az = accelerationIncludingGravity.z;
	
	var rotation = event.rotationRate;
	alpha = rotation.alpha;
	beta = rotation.beta;
	gamma = rotation.gamma;
	
	if(measurementActive) { // record data
		if (task_start = -1.0) {
			cX = ax;
			cY = ay;
			cZ = az;
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

	time = performance.now() - task_start;
	
	var outTime = (Math.round(time) / 1000.0);
	document.querySelector("#x_acc").innerHTML = "X = " + ax;
	document.querySelector("#y_acc").innerHTML = "Y = " + ay;
	document.querySelector("#z_acc").innerHTML = "Z = " + az;
	document.querySelector("#time_acc").innerHTML = "Time = " + outTime;
	
	document.querySelector("#mag_alpha").innerHTML = "alpha = " + alpha;
	document.querySelector("#mag_beta").innerHTML = "beta = " + beta;
	document.querySelector("#mag_gamma").innerHTML = "gamma = " + gamma;
	
	// measurements per second
	tick = tick + 1;
	if (time - lastTime >= 1000.0) {
		lastTime = Math.floor(time);
		document.querySelector("#tick_acc").innerHTML = "Ticks per Second = " + tick;
		tick = 0;
	}    
}

// trial for z distance
function calculateDistance(data) {
    var speed = [];
	speed.push(0.0);
	
	var sum = 0.0;
	for (var i = 1; i < data.length; i++) {
		if (data[i]["time"] < data[i-1][time]) {
			return -1.0;
		}
	} 
	return 0.0;
		
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



