var url = require("url")


// Database Code
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/test');

var collection = db.get('data');

exports.addObject = function(req, res) {
	console.log(req.query)
	var longitude = req.query.longitude;
	var latitude = req.query.latitude;
	var description = req.query.description;
	var address = req.query.address;
	var date = new Date();
	var object = {"loc": {"type": "Point", "coordinates": [longitude, latitude]},
				"description": description, "address": address,
				"status": "Available", "time": date};
	collection.insert(object);

}