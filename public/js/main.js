//Main JavaScript File
curPos = new google.maps.LatLng(46, 46);

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
	//returns a coordinate object containing current position
	
	function getPosition(){
		if(navigator.geolocation)
		{
			navigator.geolocation.getCurrentPosition(function(position){	
				curPos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			});
		} else {
			curPos = new google.maps.LatLng(46, 46);
		}
	}
	
}

/// Map Page View//Controller Code
{
	$(document).on("pageinit", "#map", function(){
	
	//Get the data (from static file for testing)
	var TrashList = new DataObject(ExampleData);
	exampleTrash = TrashList.next();
	alert(exampleTrash.name);
	//Create the map controller
	getPosition();
	mapController = new MapCont('map-canvas', curPos.lat(), curPos.lng(), 10);
	mapController.addMarker(curPos.lat(), curPos.lng(), 1000);
		
   });

	//Map Classes
	/// MapCont(canvasId, latitude, longitude, zoomLevel)
	{
		function MapCont(canvasId, latitude, longitude, zoomLevel){
			this.canvas = canvasId;
			this.mapPosition = new google.maps.LatLng(latitude, longitude);
			this.curPosition = getPosition();
			this.zoom = zoomLevel;
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
		
		MapCont.prototype.addMarker = function(lat, lng, objectId){
			this.locationMarker = new google.maps.Marker({
				position: new google.maps.LatLng(lat, lng),
				map: this.map,
				id: objectId
				});
		}
		
	}//End of MapCont Class
	
}//End of Map Code

$(document).ready(function() { 
    var options = { 
        //target:        '#output2',   // target element(s) to be updated with server response 
        beforeSubmit:  showRequest,  // pre-submit callback 
        success:       showResponse,  // post-submit callback 
        url: "api/addObject?",
 		resetForm: true

        // other available options: 
        //url:       url         // override for form's 'action' attribute 
        //type:      type        // 'get' or 'post', override for form's 'method' attribute 
        //dataType:  null        // 'xml', 'script', or 'json' (expected server response type) 
        //clearForm: true        // clear all form fields after successful submit 
        //resetForm: true        // reset the form after successful submit 
 
        // $.ajax options can be used here too, for example: 
        //timeout:   3000 
    }; 
 
    // bind to the form's submit event 
    $('#postData').submit(function() { 
    	console.log(this)
    	options["url"] += $("#postData").formSerialize();
    	console.log(options["url"])
    	console.log($("#postData").formSerialize())
	    console.log(options)

        // inside event callbacks 'this' is the DOM element so we first 
        // wrap it in a jQuery object and then invoke ajaxSubmit 
        $(this).ajaxSubmit(options); 
 
        // !!! Important !!! 
        // always return false to prevent standard browser submit and page navigation 
        return false; 
    }); 
}); 
 
// pre-submit callback 
function showRequest(formData, jqForm, options) { 
    // formData is an array; here we use $.param to convert it to a string to display it 
    // but the form plugin does this for you automatically when it submits the data 
    var queryString = $.param(formData); 
 
    // jqForm is a jQuery object encapsulating the form element.  To access the 
    // DOM element for the form do this: 
    // var formElement = jqForm[0]; 
 
    alert('About to submit: \n\n' + queryString); 
 
    // here we could return false to prevent the form from being submitted; 
    // returning anything other than false will allow the form submit to continue 
    return true; 
} 
 
// post-submit callback 
function showResponse(responseText, statusText, xhr, $form)  { 
    // for normal html responses, the first argument to the success callback 
    // is the XMLHttpRequest object's responseText property 
 
    // if the ajaxSubmit method was passed an Options Object with the dataType 
    // property set to 'xml' then the first argument to the success callback 
    // is the XMLHttpRequest object's responseXML property 
 
    // if the ajaxSubmit method was passed an Options Object with the dataType 
    // property set to 'json' then the first argument to the success callback 
    // is the json data object returned by the server 
 
    alert('status: ' + statusText + '\n\nresponseText: \n' + responseText + 
        '\n\nThe output div should have already been updated with the responseText.'); 
} 

















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
}

//Determines which button it should be
function chatOrPic(input){
	console.log("chat or pic")
	var $chatPicButt = $('#chatPicButt');
	var preview = document.getElementById('picture');
	if ($chatPicButt.attr("value") == "picture"){
		document.getElementById('uploadedImage').click();
	}else{
		iconPicSize = getIconPicSize(preview.clientWidth,preview.clientHeight);
		$.mobile.changePage('#map', { transition: "slide"} );
	}
}

//submits give item form
//function formSubmit() {

/*
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
			alert("Successful get!")
			console.log(result);
		}
	})
	
*/

/*
	//sample DELETE request
	//set deleteId equal to object's _id field
	var deleteId = 533ae6ba4fad157c32000003;
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
*/


	//sample POST request
	//actual data should be gotten from user input and location should be gotten through Maps API
/*
	var longitude = 30.232;
	var latitude = -23.432;
	var name = "My couch";
	var description = "This is my old couch";
	var category = "Furniture";
	var pickUp = "Pick up in my front yard";
	var available = 7;
	var image = "..."

	dataString = "&longitude=" + longitude + "&latitude=" + latitude + "&name=" + name;
	dataString+= "&description=" + description + "&category=" + category + "&pickUp=" + pickUp;
	dataString += "&available=" + available + "&image=" + image;

	$.ajax({
		url: "api/addObject?" + dataString,
		type:'POST',
		success: function(result) {
			alert("Successful post!")
		},
		error: function(xhr, status) {
			console.log(status);
		},
		complete: function(result){
			console.log(result);
		}
	})
	
}*/
