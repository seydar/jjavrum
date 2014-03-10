//Setup Code //////////////////////////////////////////////////
var express = require('express');
var http = require('http')

var read = require('./server/read.js')
var write = require('./server/write.js')

app = express();
app.set('port', process.env.PORT || 8888);
app.use(express.static(__dirname + '/public'));
app.listen(app.get('port'));

// Database Code
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/test');

var collection = db.get('data');
//sets index for accessing posts by location
collection.ensureIndex({"loc":"2dsphere"})


/*testObject = {"loc": {"type": "Point", "coordinates": [-83.7263, 42.20833]},
				"name":"new object","description": "this is a description", "pickUp": "pickup at my house", 
				"category":"thing","available":"for 3 days", 
				"status": "Available", "time": new Date()};

collection.insert(testObject)*/

/*
collection.insert({otherObject: true})

collection.find({}, function(err, docs) {
	console.log("All")
	console.log(docs);
})

collection.find({loc: { $near: 
		{	$geometry:
			{	type: "Point",
				coordinates: [-83.72, 42.20]
			}
		}
	}}, function(err, docs) {
		console.log("second")
		console.log(docs)
		console.log(err)
	}
)

collection.find({loc: { $near: 
		{	$geometry:
			{	type: "Point",
				coordinates: [-83.72, 42.20]
			}
		}, $maxDistance:100000
	}}, function(err, docs) {
		console.log("third")
		console.log(docs)
		console.log(err)
	}
)
*/
app.get("/", function(req, res){
	res.sendFile("index.html");
	console.log("running")
});

app.get('/api/getObjects', read.getObjects)
app.post('/api/addObject', write.addObject)


	