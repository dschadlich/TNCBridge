var Client = require('node-rest-client').Client;

var client = new Client();



var args = {
	data: { test: "hello" },
	headers: { "Content-Type": "application/json" }
};

client.registerMethod("postMethod", "http://localhost:3000/api/v1/balloon", "PUT");

client.methods.postMethod(args, function (data, response) {
	// parsed response body as js object
	console.log(data);
	// raw response
	console.log(response);
});
