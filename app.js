//Setup Code //////////////////////////////////////////////////
var express = require('express');
var http = require('http')

var read = require('./server/read.js')
var write = require('./server/write.js')
var Db = require('mongodb').Db
var Server = require('mongodb').Server
var MongoClient = require('mongodb').MongoClient;
var Grid = require('mongodb').Grid;




app = express();

app.set('port', process.env.PORT || 8888);
app.use(express.static(__dirname + '/public'));
app.listen(app.get('port'));

app.configure(function(){
	app.use(express.methodOverride());
	app.use(express.bodyParser({}));
});


//initializes gridfs db for images
Db.connect("mongodb://localhost:27017/imagesDB", function(err, db) {
  if(err) return console.dir(err);

  var grid = new Grid(db, 'fs');    
 /* grid.put(buffer, {metadata:{category:'text'}, content_type: 'text'}, function(err, fileInfo) {
    if(!err) {
      console.log("Finished writing file to Mongo");
    }
    });*/
});



// Database Code
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/justakeDB');

var collection = db.get('data');
//sets index for accessing posts by location
collection.ensureIndex({"loc":"2dsphere"})


testObject = {"loc": {"type": "Point", "coordinates": [21.34, 33.33]},
				"name":"new object","description": "this is a description", "pickUp": "pickup at my house", 
				"category":"thing","available":"for 3 days", 
				"status": "Available", "time": new Date()};

//collection.insert(testObject)

/*var db = new Db('imagesDB', new Server('localhost', 27017))
db.open(function(err, db) {
	console.log("open db")
	var grid = new Grid(db, 'fs')
})*/

console.log("server starting")

collection.find({}, function(err, docs) {
	console.log("All")
	//console.log(docs);
})


app.get("/", function(req, res){
	res.sendFile("index.html");
	console.log("running")
});


var minutes = 1;
var interval = minutes*60*1000;
//runs every hour to remove any entry that has passed its expiration time
setInterval(function() {
	var curTime = new Date();
	var removeObj = {"availableUntil": {$lt : new Date()}};
	collection.remove(removeObj, function(err, response) {
		console.log("interval function running")
		console.log(response);
	});
 
}, interval)

app.get('/api/getObjects', read.getObjects)
app.post('/api/addObject', write.addObject)
app.delete('/api/deleteObject/:objectId', write.deleteObject);


	