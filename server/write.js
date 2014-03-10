var url = require("url")


// Database Code
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/test');

var collection = db.get('data');
collection.find({}, function(err, docs) {
	console.log(docs);
})

//database objects should also have an image (use gridFS?) and a username

//adds an object to the database
exports.addObject = function(req, res) {
	console.log(req.query)
	var longitude = parseFloat(req.query.longitude);
	var latitude = parseFloat(req.query.latitude);
	var name = req.query.name;
	var description = req.query.description;
	var category = req.query.category;
	var pickUp = req.query.pickUp;
	var available = req.query.available
	var date = new Date();
	var object = {"loc": {"type": "Point", "coordinates": [longitude, latitude]},
				"name":name,"description": description, "pickUp": pickUp, 
				"category":category,"available":available, 
				"status": "Available", "time": date};
	collection.insert(object, function(err, response) {
		console.log(response);
		console.log(err)
	});
	console.log(object)
}