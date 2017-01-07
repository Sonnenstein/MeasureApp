// A script to perform rotations in 3d space. All angles are meant to be degree.

// rotates arround x-Axis
function rotateX(vec, angle) {
	var res = [];
	var a = angle / 360 * 2 * Math.PI;
	res["x"] = vec["x"];
	res["y"] = Math.cos(a) * vec["y"] - Math.sin(a) * vec["z"]; 
	res["z"] = Math.sin(a) * vec["y"] + Math.cos(a) * vec["z"];
	return res;
}

// rotates arround y-Axis
function rotateY(vec, angle) {
	var res = [];
	var a = angle / 360 * 2 * Math.PI;
	res["x"] = Math.cos(a) * vec["x"] - Math.sin(a) * vec["z"];
	res["y"] = vec["y"];
	res["z"] = Math.sin(a) * vec["x"] + Math.cos(a) * vec["z"];
	return res
}

// rotates arround z-Axis
function rotateZ(vec, angle) {
	var res = [];
	var a = angle / 360 * 2 * Math.PI;
	res["x"] = Math.cos(a) * vec["x"] - Math.sin(a) * vec["y"]; 
	res["y"] = Math.sin(a) * vec["x"] + Math.cos(a) * vec["y"]; 
	res["z"] = vec["z"];
	return res;
} 

// transforms from device to world based on measurement of device
function transformDeviceToWorld(vec, angleAlpha, angleBeta, angleGamma) {
	var res = vec;
	res = rotateZ(res, angleAlpha);
	res = rotateX(res, angleBeta);
	res = rotateY(res, angleGamma);
	return res;
}

// transforms from world to device based on measurement of device
function transformWorldToDevice(vec, angleAlpha, angleBeta, angleGamma) {
	var res = vec;
	res = rotateY(res, -angleGamma);
	res = rotateX(res, -angleBeta);
	res = rotateZ(res, -angleAlpha);
	return res;
}