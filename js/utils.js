function show_props(obj, objName) {
	var result = "";
	for ( var i in obj) {
		result += objName + "." + i + " = " + obj[i] + "\n";
	}
	console.log(result);
	return result;
}