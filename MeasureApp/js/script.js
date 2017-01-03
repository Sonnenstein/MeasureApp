var clock = 0.0;
var task_start = performance.now();
var tick = 0;
var lastTime = 0.0;

var alpha = 0.0;
var beta = 0.0;
var gamma = 0.0;

if (window.DeviceMotionEvent) {
  console.log("DeviceMotionEvent supported");
} 

if ((window.DeviceMotionEvent) {
  window.addEventListener('devicemotion', deviceMotionHandler, false);
} else {
  document.getElementById("dmEvent").innerHTML = "Not supported."
}

function startMeasurement() {

	if (Math.abs(beta) < 2.0 && Math.abs(gamma) < 2.0) {
		document.querySelector("#dist_acc").innerHTML = "Balanced";
		document.querySelector("#dist_acc").style.backgroundColor = 'green';
	}
}


function deviceMotionHandler(event) {
	var ax = event.acceleration.x;
	var ay = event.acceleration.y;
	var az = event.acceleration.z;


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






