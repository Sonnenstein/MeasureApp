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
const DISPLAY = 4;
const WELCOME1 = 5;
const WELCOME2 = 6;
const WELCOME3 = 7;


$(document).ready(function() {
	var isChrome = !!window.chrome && !!window.chrome.webstore;
	if (isChrome) {
		alert("Found Chrome!");
	} 
	calibrateScreen();
	welcome1();
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

function welcome1() {
	state = WELCOME1;
	listMeasurments();
	document.querySelector("#desc").innerHTML  = "Please hold your device at <b> any time </b> in an <b><span style='color:#90ee90;'>even</span></b> position!";
	document.querySelector("#actionBtn").innerHTML = "Continue";
}

function welcome2() {
	state = WELCOME2;
	document.querySelector("#desc").innerHTML  = "You will be able to perform height measurements by <b> either </b> moving your device up <b> or </b> down.";
	document.querySelector("#actionBtn").innerHTML = "Continue";
}

function welcome3() {
	state = WELCOME3;
	document.querySelector("#desc").innerHTML  = "To measure put your device at the lower or higher end of your wished height, press start, move it to the other end and press stop.";
	document.querySelector("#actionBtn").innerHTML = "Continue";
}


function init() {
	state = INIT;
	document.querySelector("#desc").innerHTML  = "Now please <b> hold still </b> and press the button to calibrate your device.";
	document.querySelector("#actionBtn").innerHTML = "Calibrate";
}

function calibrate() {
	state = CALIBRATE;
	document.querySelector("#desc").innerHTML  = "Please wait...";	
	document.querySelector("#actionBtn").innerHTML = "Now Calibrating";
	startNewMeasurement();
}

function ready() {
	state = READY;
	document.querySelector("#desc").innerHTML  = "The device is ready. <b>Faster</b> measurements tend to be more acurate.";	
	document.querySelector("#actionBtn").innerHTML = "Start";	
}

function measure() {
	state = MEASURING;
	startNewMeasurement();
	document.querySelector("#desc").innerHTML  = "Now measuring. Press again to stop measurement.";
	document.querySelector("#actionBtn").innerHTML = "Stop";
}

function display() {
	state = DISPLAY;
	stopMeasurement();
	calculateDistance();
	listMeasurments();
	document.querySelector("#desc").innerHTML  = "Press button to prepare device for a new measurement.";	
	document.querySelector("#actionBtn").innerHTML = "Prepare";
}


function performAction() {
	switch (state) {
		case WELCOME1: welcome2();
			break;
		case WELCOME2: welcome3();
			break;
		case WELCOME3: init();
			break;
		case INIT: calibrate();
			break;
		case CALIBRATE: document.getElementById("actionBtn").value = "Please wait";
			break;
		case READY: measure();
			break;
		case MEASURING: display();
			break;
		case DISPLAY: ready();
			break;
		default: alert("System is in an invalid state: " + state + ". Please restart application.");
			break;
	}
}

/*

	// vmousedown
	// vmouseup

*/