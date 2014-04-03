var url = require("url")
var express = require("express")
var mongo = require('mongodb');
var Grid = require('gridfs-stream')
var fs = require('fs');


// Database Code
var monk = require('monk');
var db = monk('localhost:27017/justakeDB');

var collection = db.get('data');

/*
var imagesDB = monk('localhost:27017/iamgesDB')
var grid = new Grid(imagesDB, 'fs')
GridStore.exists(imagesDB, "a.txt")*/

var gfs = Grid(imagesDB, mongo)

//https://stackoverflow.com/questions/16482233/store-file-in-mongos-gridfs-with-expressjs-after-upload

//database objects should also have an image (use gridFS?) and a username

//adds an object to the database
exports.addObject = function(req, res) {
	/*
	//IGNORE: experimenting with file upload procedures
	var gridStore = new GridStore(imagesDB, new ObjectID());
	gridStore.open(function(err, gridStore) {
		console.log("one")
		gridStore.write(new Buffer("Hello world"), function(err, gridStore){
			console.log(gridStore);
			gridStore.close();
		});
	});
	
	var tempfile = req.files.filename.path;
	var origname = req.files.filename.name;
	var writestream = gfs.createWriteStream({filename: origname});
	fs.createReadStream(tempfile)
		.on('end', function() {
			console.log('OK')
			res.send('OK')
		})
		.on('error', function() {
			console.og('ERR')
			res.send('ERR')
		})
		.pipe(writestream);*/

	
	
	console.log(req.query)
	var longitude = parseFloat(req.query.longitude);
	var latitude = parseFloat(req.query.latitude);
	var name = req.query.name;
	var description = req.query.description;
	var category = req.query.category;
	var pickUp = req.query.pickUp;
	var daysAvailable = parseInt(req.query.available)
	var availableUntil = new Date();
	availableUntil.setDate(availableUntil.getDate() + daysAvailable);
	console.log(availableUntil);

	var date = new Date();
	var object = {"loc": {"type": "Point", "coordinates": [longitude, latitude]},
				"name":name,"description": description, "pickUp": pickUp, 
				"category":category,"availableUntil":availableUntil, 
				"available":daysAvailable, "status": "Available", "time": date};



	collection.insert(object, function(err, response) {
		console.log(response);
		console.log(err)
		if (err == null) {
			console.log("success")
			res.send(200);
		}
		else {
			res.send(400);
		}
	});
}

exports.deleteObject = function(req, res) {
	console.log(req.params);
	var objectId = req.params.objectId;
	var removeObj = {"_id":objectId};
	collection.remove(removeObj, function(err, response) {
		console.log("item with id " + objectId + " deleted.");
		console.log(response);
		res.send(200);
	});

}