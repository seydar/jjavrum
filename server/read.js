var url = require("url")


// Database Code
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/test');
var collection = db.get('data');


//converts miles to meters
function milesToMeters(miles){
	return miles*1609.34;
}

/*returns an object to query the database from a query object
passed through the URL*/
function queryBuilder(queryObject){
	var returnQuery = {};
	//checks for both a latitude and a longitude before adding either to the database query
	if (parseFloat(queryObject.longitude) && parseFloat(queryObject.latitude)){
		var longitude = parseFloat(queryObject.longitude);
		var latitude = parseFloat(queryObject.latitude);

		var geometry = {"type": "Point", "coordinates":[longitude, latitude]};
		var near = {"$geometry": geometry};
		//adds distance from the coordinates if included in the original query
		if (parseFloat(queryObject.distance)){
			var miles = parseFloat(queryObject.distance);
			var meters = milesToMeters(miles)
			near["$maxDistance"] = meters;
		}
		var loc = {"$near":near};
		returnQuery["loc"] = loc;
	}
	//adds a category query if requested 
	if (queryObject.category) {
		returnQuery["category"] = queryObject.category;
	}
	console.log(returnQuery);
	return returnQuery;

}

/*Parses the query string given by the URL, finds objects that pass the filter in the database
and returns them*/
exports.getObjects = function(req, res) {
	var searchQuery = queryBuilder(req.query);
	collection.find(searchQuery, function(err, docs) {
		//console.log(docs)
		res.send(docs)
	});
}