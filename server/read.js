var url = require("url");
var mongo = require('mongodb');
var fs = require('fs');
var ObjectID = require("mongodb").ObjectID
var Db = mongo.Db;
var Grid = mongo.Grid;


// Database Code
var monk = require('monk');
var db = monk('localhost:27017/justakeDB');
var collection = db.get('data');

var imagesDB = new mongo.Db('imageDB', new mongo.Server("127.0.0.1",27017), {safe: false});
var gfs = Grid(imagesDB, mongo);

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

/*retrieves a file from the imagesDB based on 
on the fileID based to it and calls a callback with
the file as a binary*/
function retrieveImage(fileId, callback) {
	console.log("retrieveImage")
	Db.connect("mongodb://localhost:27017/imagesDB", function(err, imagesDB) {

		var grid = new Grid(imagesDB, 'fs');

		grid.get(fileId, function(err, result) {
			console.log(result)
			//docs[i].image = result
			callback(result)
		})
	});
}

/*for each document passed into the docs array, 
retrieveImage is called to get the associated file from
the document's fileID value. Once this has been successfully 
executed on all docs in the array, a callback is returned 
with the every document object also including the associated file as a binary
*/function matchDocs(docs, callback){
	console.log("matchDocs")
	var inserted = 0;
	resultsArray = [];
	for (var i = 0; i < docs.length; i++) {
		var doc = docs[i];
		var fileId = docs[i].fileId;
		console.log(fileId)
		retrieveImage(fileId, function(result) {
			console.log("callback called")
			console.log(result)
			//convert binary data to base64 encoded string
			doc.image = result.toString('base64')
			doc.latitude = doc.loc.coordinates[1];
			doc.longitude = doc.loc.coordinates[0];
			resultsArray.push(doc)

			if (resultsArray.length == docs.length) {
				console.log("sending callback")
				equal = true;
				callback(resultsArray)
			}
			else{
				console.log("not yet")
				console.log(resultsArray.length)
				console.log(docs.length)
			}
			//docs[i].image = result
		})
		
	}
	/*var equal = false;
	//checks to see if all of the callbacks have successfully completed
	setTimeout(function() {
		while(!equal) {
			console.log("running")
			console.log(resultsArray);
			
		}

	}, 3)*/
}

/*Parses the query string given by the URL, finds objects that pass the filter in the database
and returns them*/
exports.getObjects = function(req, res) {
	console.log("get request")
	Db.connect("mongodb://localhost:27017/imagesDB", function(err, imagesDB) {
		var grid = new Grid(imagesDB, 'fs');
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
				//console.log("success")
				//console.log(docs)
				//if nothing found, return immediately
				if (docs.length == 0) {
					res.send(200)
				}
				var inserted = 0;
				var resultArray = [];
				matchDocs(docs, function(resultsArray) {
					console.log("matchDocs callback")
					console.log(resultsArray)
					for (i = 0; i < resultsArray.length; i++) {

					}
					res.send(resultsArray)
				})
				
			});
		}
		else {
			console.log("error")
			res.error("Longitude and Longitude required");
		}

	})
	
}