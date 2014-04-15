var url = require("url")
var express = require("express")
var mongo = require('mongodb');
var fs = require('fs');

var Db = require('mongodb').Db,
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    ReplSetServers = require('mongodb').ReplSetServers,
    ObjectID = require('mongodb').ObjectID,
    Binary = require('mongodb').Binary,
    GridStore = require('mongodb').GridStore,
    Grid = require('mongodb').Grid,
    Code = require('mongodb').Code,
    BSON = require('mongodb').pure().BSON,
    assert = require('assert');


// Database Code
var monk = require('monk');
var db = monk('localhost:27017/justakeDB');

var collection = db.get('data');

var imagesDB = new mongo.Db('imagesDB', new mongo.Server("127.0.0.1",27017), {safe: false});



//adds an object to the database
exports.addObject = function(req, res) {
	if (!req.files.uploadedImage) {
		res.send(400);
	}
	//creates a temporary file from the uploaded file
	var tempfile = req.files.uploadedImage.path;
	//creates a name for the file
	var origname = req.files.uploadedImage.name;
	//creates a readstream for the file
	var readstream = fs.createReadStream(tempfile);
	console.log(req.query)

	imagesDB.open(function(err, imagesDB) {
		//creates a new gridstore to upload the file to
		var gridStore =  new GridStore(imagesDB, new ObjectID(), 'w');
		var fileSize = fs.statSync(tempfile).size
		gridStore.open(function(err, fileData){
			//writes file to gridstore
			gridStore.writeFile(tempfile, function(err, fileData){

				assert.equal(null, err);
				//closes imagesDB after adding the new file
				imagesDB.close();
				//gets the fileID to add to the main database object
				var fileId = fileData["fileId"];
				
				//parses parameters from the submitted query
				//checks to make sure all are submitted as part of the query
				//and none are longer than the maximum length
				if (req.query.longitude){
					if (req.query.longitude.length <= 100) {
						var longitude = parseFloat(req.query.longitude);
					}
					else {
						res.send(403);
						return;
					}
				}
				else {
					res.send(403);
					return;
				}

				if (req.query.latitude){
					if (req.query.latitude.length <= 100){
						var latitude = parseFloat(req.query.latitude);
					}
					else {
						res.send(403);
						return;
					}
				}
				else {
					res.send(403);
					return;
				}
				
				if (req.query.name){
					if (req.query.name.length <= 120) {
						var name = req.query.name;
						console.log(name.length)
					}
					else {
						res.send(403);
						return;
					};	
				}
				else {
					res.send(403);
					return;
				}
				
				if (req.query.description) {
					if (req.query.description.length <= 1000) {
						var description = req.query.description
					}
					else {
						res.send(403);
						return;
					}	
				}
				else {
					res.send(403);
					return;
				}
				
				if (req.query.pickUp) {
					if (req.query.pickUp.length <= 600) {
						var pickUp = req.query.pickUp;
					}
					else {
						res.send(403);
						return;
					}
				}
				else {
					res.send(403);
					return;
				}
				
				if (req.query.category) {
					if (req.query.category.length <= 100) {
						var category = req.query.category;
					}
					else {
						res.send(403);
						return;
					}
				}
				else {
					res.send(403);
					return;
				}

				if (req.query.available) {
					if (req.query.available) {
						var daysAvailable = parseInt(req.query.available)
					}
					else {
						res.send(403);
						return;
					}
				}
				else {
					res.send(403);
					return;
				}
				var availableUntil = new Date();
				availableUntil.setDate(availableUntil.getDate() + daysAvailable);
				//console.log(availableUntil);

				var date = new Date();
				var object = {"loc": {"type": "Point", "coordinates": [longitude, latitude]},
							"name":name,"description": description, "pickUp": pickUp, 
							"category":category,"availableUntil":availableUntil, 
							"available":daysAvailable, "status": "Available", 
							"time": date, "fileId": fileId};
				console.log(object)

				//inserts the object into the collection
				collection.insert(object, function(err, response) {
					//console.log(response);
					//console.log(err)
					if (err == null) {
						console.log("success")
						res.send(200);
					}
					else {
						res.send(400);
					}
				});
				console.log('OK')
			})
		})
	})
}


exports.deleteObject = function(req, res) {
	console.log(req.params);
	var objectId = req.params.objectId;
	var removeObj = {"_id":objectId};
	collection.find(removeObj, function(err, response) {
		if (err) {
			res.send(400);
			return;
		}
		if (response.length == 0) {
			res.send(400);
			return;
		}
		var fileId = String(response[0].fileId);
		console.log(fileId)
		console.log(typeof(fileId))
		var fileObjId = ObjectID(fileId);
		var imagesMonk = monk('localhost:27017/imagesDB');

		var filesCollection = imagesMonk.get('fs.files');
		var chunksCollection = imagesMonk.get('fs.chunks');
		var fileRemoveObj = {"_id":fileObjId};
		var chunksRemoveObj = {"files_id":fileObjId}
		chunksCollection.remove(chunksRemoveObj, function(err, response) {
			console.log("item with id " + fileId + " deleted from chunksCollection")
			console.log(response);
			filesCollection.remove(fileRemoveObj, function(err, response) {
				console.log("item with id " + fileId + " deleted from filesCollection")
				console.log(response);
				collection.remove(removeObj, function(err, response) {
					console.log("item with id " + objectId + " deleted.");
					console.log(response);
					res.send(200);
				});
			})
		})
	});
}