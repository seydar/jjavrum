//Main JavaScript File
///Global Variables
{
	//The Map Controller; Create with map initalize
	var mapController = null;
    var positionTimer = null;
	//Holds all trash to be displayed populate with data at load
	var TrashList = null;
	//Your current latitude at any given time
	curLat = 46;
	//Your current logitutde at any given time
	curLng = 46;
}

/// Data Object Class (Model Copy)
function DataObject(data){
    // Creator
    this.DataArray = [];
    if (typeof data != "undefined")
    {
        this.DataArray = data;
    }

    // Properties
    this.index = -1;
    this.length = this.DataArray.length;

    // Methods
    this.add = function(feature)
    {
        this.DataArray.push(feature);
        this.length = this.DataArray.length;
    }

    this.addProperty = function(name, value)
    {
        if (this.index >= 0)
        {
			this.DataArray[this.index][name] = value;
        }
    }

    this.get = function(index)
    {
        if (index < this.DataArray.length)
        {
			return this.DataArray[index];
        }
        return null;
    }

    this.rewind = function()
    {
        this.Index = -1;
    }

    this.next = function()
    {
        this.index += 1;
        if (this.index < this.DataArray.length)
        {
        return this.DataArray[this.index];
        }
        this.index = -1;
        return null;
    }

    this.filter = function(field, value)
    {
        var list = new FeatureList();
        for (var i = 0; i < this.DataArray.length; i++)
        {
        var result = false;
        eval ("result = this.DataArray[i]." + field + ".indexOf(\"" + value + "\") >= 0")
        if (result)
        {
            list.add(this.DataArray[i]);
        }
        }
        return list;
    }
	
    this.list = function(field)
    {
        var list = [];
        for (var i = 0; i < this.DataArray.length; i++)
        {
        var value = this.DataArray[i][field];
        var l;
        for (l = 0; l < list.length; l++)
        {
            if (value == list[l])
            {
            break;
            }
        }
        if (l >= list.length)
        {
            list.push(value);
        }
        }
        return list;
    }
}

/// Controller Code (domain specific)
{
	//initalize the map and sets up location finding services
	function mapInitialize(){
		if(navigator.geolocation)
		{
			navigator.geolocation.getCurrentPosition(function(position){	
				curLat = position.coords.latitude;
				curLng = position.coords.longitude;
				//Create the Map
				mapController = new MapCont('map-canvas', curLat, curLng, 17);
				//Add position Marker 
				mapController.addMarker(curLat, curLng, -1);
				//Add the entrire TrashList to the map
				mapController.populateMap();
				//Set up the positionTimer to watch and update our position
				positionTimer = navigator.geolocation.watchPosition(function(position){
					// Update Curent Position		
					curLat = position.coords.latitude;
					curLng = position.coords.longitude;
					if (mapController = NULL){
					}
				});
			
			});
		} 
	}
	
	//returns a coordinate object containing current position ***Use in get code***
	function getPosition(){
		return new google.maps.LatLng(curLat, curLng);
	}
	
	//populate the trash list ***Hook into server***
	//Adds mapId property to each item in the list
	function populateTrashList(miles){
		TrashList = new DataObject(ExampleData);
		// Add a number to use as the Google Map Marker to each item on the list
		TrashList.rewind(); 
		var item = TrashList.next();
		var i = 0;
		while (item != null){
			TrashList.addProperty("mapId", i); 
			var item = TrashList.next();
			i++;     
		}
	}
}

/// Map Page View//Controller Code
{
	$(document).on("pageinit", "#map", function(){
	
	//Get the data (from static file for testing)
	populateTrashList(100000);
	//Create the map controller and populates the map
	mapInitialize();	
   });

	//Map Classes
	/// MapCont(canvasId, latitude, longitude, zoomLevel)
	{
		function MapCont(canvasId, latitude, longitude, zoomLevel){
			this.canvas = canvasId;
			this.mapPosition = new google.maps.LatLng(latitude, longitude);
			this.curPosition = getPosition();
			this.zoom = zoomLevel;
			this.markerData = new Array();
			this.options = {
				center: this.mapPosition,
				zoom: this.zoom,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				streetViewControl: false,
				mapTypeControl: false,
				zoomControl: true,  
				zoomControlOptions: {style: google.maps.ZoomControlStyle.SMALL, position: google.maps.ControlPosition.TOP_LEFT },
				panControl: false
			}
			this.map = new google.maps.Map(document.getElementById(this.canvas), this.options);	
		}
		
		//adds a marker to the map
		MapCont.prototype.addMarker = function(lat, lng, objectId){
			    var locationMa = new google.maps.Marker({
				position: new google.maps.LatLng(lat, lng),
				map: this.map,
				id: objectId
				});
		}
		
		//pans the map to the users position
		MapCont.prototype.panToPosition = function(){
			this.map.panTo(getPosition());
		}
		
		//places all items on the map within the specified miles
		MapCont.prototype.populateMap = function(){
			TrashList.rewind(); 
			var item = TrashList.next();
			var i = 0;
			while (item != null)
			{
				alert(item.latitude);
				itemPos = new google.maps.LatLng(item.latitude, item.longitude);
				this.markerData[item.mapId] = new google.maps.Marker({
					position: itemPos,
					map: this.map,
					title: item.name
				});
				this.markerData[item.mapId].ID = item.ID;
				this.markerData[item.mapId].index = item.mapId;
				
				/*google.maps.event.addListener(markerData[item.mapId], 'click', function(e) {
					infobox.close();
					infobox.setContent(infoContent(this.index));
					infobox.open(map, this);
					map.panTo(100,100);

				});*/

				var item = TrashList.next();
				i++;     
			}
		}
		
	}//End of MapCont Class
	
}//End of Map Code

<<<<<<< HEAD




=======
//code for submitting a post request to the server
>>>>>>> 1cfc331fabfa8f1db27ffb1462a0c6cb0f36ec38
$(document).ready(function() { 
    var options = { 
        beforeSubmit:  showRequest,  // pre-submit callback 
        success:       showResponse,  // post-submit callback 
        url: "api/addObject?",
 		resetForm: true

    }; 
 
    // bind to the form's submit event 
    $('#postData').submit(function() { 
    	console.log(this)
    	options["url"] += $("#postData").formSerialize();
    	console.log(options["url"])
    	console.log($("#postData").formSerialize())
	    console.log(options)

        $(this).ajaxSubmit(options); 
 
        // !!! Important !!! 
        // always return false to prevent standard browser submit and page navigation 
        return false; 
    }); 
}); 
 
//callback called just before uploading to server
function showRequest(formData, jqForm, options) { 
    // formData is an array; here we use $.param to convert it to a string to display it 
    // but the form plugin does this for you automatically when it submits the data 
    var queryString = $.param(formData);  
    alert('About to submit: \n\n' + queryString); 
    return true;
} 
 
// callback called after successful upload to the server
function showResponse(responseText, statusText, xhr, $form)  { 
 
    alert('status: ' + statusText + '\n\nresponseText: \n' + responseText + 
        '\n\nThe output div should have already been updated with the responseText.'); 
<<<<<<< HEAD
} 



=======
}
/*
>>>>>>> 1cfc331fabfa8f1db27ffb1462a0c6cb0f36ec38
function previewImage(input) {
	console.log("preview")
	var preview = document.getElementById('picture');
	if (input.files && input.files[0]) {
		var $chatPicButt = $('#chatPicButt');
	  	var reader = new FileReader();
	  	reader.onload = function (e) {
			preview.setAttribute('src', e.target.result);
			curPic = e.target.result;
			$chatPicButt.attr("value", "chat");
			$chatPicButt.html("Chat!");

	 	}
	  	reader.readAsDataURL(input.files[0]);
	} else {
	  preview.setAttribute('src', '/images/imposter.png');
	}
}*/

//opens dialog for choosing a file to submit
//change to support opening of the camera later?
//don't quite remember how this works in terms of a device's camera
function chatOrPic(input){
	console.log("chat or pic")
	var $chatPicButt = $('#chatPicButt');
	//var preview = document.getElementById('picture');
	if ($chatPicButt.attr("value") == "picture"){
		document.getElementById('uploadedImage').click();
	}else{
		iconPicSize = getIconPicSize(preview.clientWidth,preview.clientHeight);
		$.mobile.changePage('#map', { transition: "slide"} );
	}
}//End of all post request code 



//sample get request to retrieve data from the server
//should be changed to support the user's actual location
function getRequest() {

	//sample GET request
	var latitude = -30.343;
	var longitude = 23.345;
	var distance = 500000000000;
	var getUrl = "api/getObjects?latitude=" + latitude + "&longitude=" + longitude + "&distance=" + distance
	$.ajax({
		url: getUrl,
		type: "GET",
		error: function(xhr, status){
			alert("Error")
		},
		success: function(result){
			//this is an example of how the returned data can be used to display an image
			//see img tag in index.html
			var $picture = $('#picture');
			alert("Successful get!")
			console.log(result);
			//console.log(result[0]["image"])
			$picture.attr("src", "data:image/jpg;base64," + result[0]["image"])
		}
	})
}


/*
	//sample DELETE request
	//set deleteId equal to object's _id field*/
function deleteRequest() {
	var deleteId = "53421b267608b78025000001";
	$.ajax({
		url: "api/deleteObject/" +  deleteId,
		type:"DELETE",
		error: function (xhr, status) {
           alert("Error")
        },
        success: function (result) {
            alert("Successful delete!");
            
        }
	})
}
