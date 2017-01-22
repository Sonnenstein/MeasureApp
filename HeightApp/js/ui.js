// current open page
var page = -1;
const MAIN = 0;
const MEASUREMENTS = 1;
const SENSORS = 2;

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

function listMeasurments() {
	document.querySelector("#measurementlist").innerHTML = "";

	if (measurementData.length > 0) {
		var avg = 0.0;
		for (var i = 0; i < measurementData.length; i++) {
			avg = avg + measurementData[i];
			$("#measurementlist").append("<li><p>" + measurementData[i] + " m" + "</p></li>");
		}		
		var outAvg = (Math.round((avg / measurementData.length) * 10000) / 10000.0);
		document.querySelector("#average_mes").innerHTML = outAvg + " m";
	} else {
		$("#measurementlist").append("<li><p>No measurments available</p></li>");
		document.querySelector("#average_mes").innerHTML = "0.0 m";
	}
	
	if (page == MEASUREMENTS) {
		$('#measurementlist').listview('refresh');
	}
}

function deleteMeasurments() {
	measurementData.length = 0;
	listMeasurments();
}

function switchToMain() {
	page = MAIN;
}

function switchToMeasurements() {
	$('#measurementlist').listview('refresh');
	page = MEASUREMENTS;
}

function switchToSensors() {
	page = SENSORS;
}
// -----------------------------------------------------------------------------------

function init() {
	state = INIT;
	listMeasurments();
	document.querySelector("#desc").innerHTML  = "Please hold still and press button to calibrate your device.";
	document.querySelector("#actionBtn").innerHTML = "Calibrate";
}

function calibrate() {
	state = CALIBRATE;
	document.querySelector("#desc").innerHTML  = "Please hold still and wait while your device is calibrating.";	
	document.querySelector("#actionBtn").innerHTML = "Now Calibrating";
	startNewMeasurement();
}

function ready() {
	state = READY;
	listMeasurments();
	document.querySelector("#desc").innerHTML  = "The device is now ready for a new measurement.";	
	document.querySelector("#actionBtn").innerHTML = "Start";
}

function measure() {
	state = MEASURING;
	startNewMeasurement();
	document.querySelector("#desc").innerHTML  = "Now measuring. Press again to stop measurement.";
	document.querySelector("#actionBtn").innerHTML = "Stop";
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

	// vmousedown
	// vmouseup

*/