

$(document).ready(function(){


	
	var measurement = [12,13,145,15];
	for (var i = 0; i < measurement.length; i++) {
		$("#measurementlist").append("<li><p>" + measurement[i] + " m" + "</p></li>");
	}
	$("#measurementlist").refresh;
	
	// vmousedown
	// vmouseup
}); 