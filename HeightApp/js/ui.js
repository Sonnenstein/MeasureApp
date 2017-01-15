function ScaleContentToDevice(){
    scroll(0, 0);
    var content = $.mobile.getScreenHeight() - $(".ui-header").outerHeight() - $(".ui-content").outerHeight() + $(".ui-content").height();
    $(".ui-content").height(content);
}

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
	
	ScaleContentToDevice();   
}); 