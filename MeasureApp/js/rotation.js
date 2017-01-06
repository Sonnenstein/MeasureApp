// A script to perform rotations in 3d space. All angles are meant to be polar coordinates.

// rotates arround x-Axis
function rotateX(vec, angle) {
	vec["x"] = vec["x"];
	vec["y"] = Math.cos(angle) * vec["y"] - Math.sin(angle) * vec["z"]; 
	vec["z"] = Math.sin(angle) * vec["y"] + Math.cos(angle) * vec["z"];
}

// rotates arround y-Axis
function rotateY(vec, angle) {
	vec["x"] = Math.cos(angle) * vec["x"] - Math.sin(angle) * vec["z"];
	vec["y"] = vec["y"];
	vec["z"] = Math.sin(angle) * vec["x"] + Math.cos(angle) * vec["z"];
}

// rotates arround z-Axis
function rotateZ(vec, angle) {
	vec["x"] = Math.cos(angle) * vec["x"] - Math.sin(angle) * vec["y"]; 
	vec["y"] = Math.sin(angle) * vec["x"] + Math.cos(angle) * vec["y"]; 
	vec["z"] = vec["z"];
}