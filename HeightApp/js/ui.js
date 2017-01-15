
// current system state
var state = -1;
const INIT = 0;
const CALIBRATE = 1;
const READY = 2;
const MEASURING = 3;
const CALCULATE = 4;

$(document).ready(function(){
	calibrateScreen();
	init();
}); 

function calibrateScreen() {
	var screen = $.mobile.getScreenHeight();
	var header = $(".ui-header").hasClass("ui-header-fixed") ? $(".ui-header").outerHeight()  - 1 : $(".ui-header").outerHeight();
	var content = screen - header;
	$(".ui-content").height(content);
}

// -----------------------------------------------------------------------------------

function init() {
	state = INIT;
	document.querySelector("#desc").innerHTML  = "Please hold still and press button to calibrate your device.";
	document.querySelector("#actionBtn").innerHTML = "Calibrate Device";
}

function calibrate() {
	state = CALIBRATE;
	document.querySelector("#desc").innerHTML  = "Please hold still and wait while your device is calibrating.";	
	document.querySelector("#actionBtn").innerHTML = "Now Calibrating";
	startNewMeasurement();
}

function ready() {
	state = READY;
	document.querySelector("#desc").innerHTML  = "The device is now ready for a new measurement.";	
	ddocument.querySelector("#actionBtn").innerHTML = "Start Measurement";
}

function measure() {
	state = MEASURING;
	startNewMeasurement();
	document.querySelector("#desc").innerHTML  = "Now measuring. Press again to stop measurement.";
	document.querySelector("#actionBtn").innerHTML = "Stop Measurement";
}

function calculate() {
	state = CALCULATE;
	stopMeasurement();
	calculateDistance();
}


function performAction() {
	switch (state) {
		case INIT: calibrate();
			break;
		case CALIBRATE: document.getElementById("actionBtn").value = "Please wait";
			break;
		case READY: measure();
			break;
		case MEASURING: calculate();
			break;
		case CALCULATE: document.getElementById("actionBtn").value = "Please wait";
			break;
		default: alert("Invalid state: " + state);
			break;
	}
}




/*
	var measurement = [12,13,145,15];
	for (var i = 0; i < measurement.length; i++) {
		$("#measurementlist").append("<li><p>" + measurement[i] + " m" + "</p></li>");
	}
	
	$("#measurementlist").empty();
		for (var i = 0; i < measurement.length; i++) {
		$("#measurementlist").append("<li><p>" + measurement[i] + " m" + "</p></li>");
	}
	// vmousedown
	// vmouseup

*/