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


/*
FUNCTION: gets objects that are within a specified distance to the user

REQUIRES: query string containing longitude and latitude
distance is an optional parameter that specificies the radius for finding
object in miles

RETURNS: Sends 412 HTTP status if correct query parameters are not included
Otherwise returns all found objects */
exports.getObjects = function(req, res) {
	//handles error if bad query and returns an error status
	if (!parseInt(req.query.longitude) || !parseInt(req.query.latitude)){
		console.log("here");
		res.send("Bad query sent to getCloseObjects function", 412);
		return;
	}

	//sets variables based on query
	var longitude = parseInt(req.query.longitude)
	var latitude = parseInt(req.query.latitude)

	//returns all objects in database if distance isn't specified
	if (!parseInt(req.query.distance)) {
		collection.find({loc: { $near: 
			{	$geometry:
				{	type: "Point",
					coordinates: [longitude, latitude]
				}
			}
		}}, function(err, docs) {
			res.send(docs)
		});
	}
	//returns all objcts in database within the specified distance
	else {
		var miles = parseInt(req.query.distance);
		var meters = milesToMeters(miles);
		collection.find({loc: { $near: 
			{	$geometry:
				{	type: "Point",
					coordinates: [longitude, latitude]
				}
			}, $maxDistance: meters
		}}, function(err, docs) {
			res.send(docs)
		});
	}
}