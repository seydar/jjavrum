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
	var tempfile = req.files.uploadedImage.path;
	var origname = req.files.uploadedImage.name;
	var readstream = fs.createReadStream(tempfile);
	console.log("here")
	imagesDB.open(function(err, imagesDB) {
		var gridStore =  new GridStore(imagesDB, new ObjectID(), 'w');
		var fileSize = fs.statSync(tempfile).size
		gridStore.open(function(err, fileData){
			gridStore.writeFile(tempfile, function(err, fileData){

				console.log(fileData)
				assert.equal(null, err);
				imagesDB.close();
				var fileId = fileData["fileId"];
				console.log(fileId)
				var longitude = parseFloat(req.query.longitude);
				var latitude = parseFloat(req.query.latitude);
				var name = req.query.name;
				var description = req.query.description;
				var category = req.query.category;
				var pickUp = req.query.pickUp;
				var daysAvailable = parseInt(req.query.available)
				var availableUntil = new Date();
				availableUntil.setDate(availableUntil.getDate() + daysAvailable);
				//console.log(availableUntil);

				var date = new Date();
				var object = {"loc": {"type": "Point", "coordinates": [longitude, latitude]},
							"name":name,"description": description, "pickUp": pickUp, 
							"category":category,"availableUntil":availableUntil, 
							"available":daysAvailable, "status": "Available", 
							"time": date, "fileId": fileId};

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