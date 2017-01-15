

$(document).ready(function(){

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
	
	var screen = $.mobile.getScreenHeight();
	var header = $(".ui-header").hasClass("ui-header-fixed") ? $(".ui-header").outerHeight()  - 1 : $(".ui-header").outerHeight();
	var content = screen - header;

	$(".ui-content").height(content);
}); 