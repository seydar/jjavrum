var url = require("url");
var mongo = require('mongodb');
var GridFS = require('GridFS').GridFS;
var GridStream = require('GridFS').GridStream


// Database Code
var monk = require('monk');
var db = monk('localhost:27017/justakeDB');
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
	//console.log(returnQuery);
	return returnQuery;
}

/*Parses the query string given by the URL, finds objects that pass the filter in the database
and returns them*/
exports.getObjects = function(req, res) {
	var searchQuery = queryBuilder(req.query);
	var latitude;
	var longitude;
	if (parseFloat(req.query.longitude) && parseFloat(req.query.latitude)){
		longitude = parseFloat(req.query.longitude)
		latitude = parseFloat(req.query.latitude);
		console.log("longitude = " + longitude);
		console.log("latitude = " + latitude);
		var orderBy = {"$geometry" : {"type": "Point", "coordinates": [longitude, latitude]}}
		collection.find( { $query: searchQuery,  $orderby: {"$near": [orderBy]}} , function(err, docs) {
			//console.log(docs)
			console.log("success")

			res.send(docs)
		
		});
	}
	else {
		console.log("error")
		res.error("Longitude and Longitude required");
	}
}