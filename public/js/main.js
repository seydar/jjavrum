//Main JavaScript File
//submits give item form
function formSubmit() {

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
	
}
