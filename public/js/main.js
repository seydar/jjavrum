//Main JavaScript File


function formSubmit() {

	var dataString = $('#postData').serialize();
	console.log(dataString);
	//lat and long should be found using maps API
	var longitude = 21.343
	var latitude = 33.3343

	dataString += "&longitude=" + longitude + "&latitude=" + latitude

	$.ajax({
		url: "api/addObject?" + dataString,
		type:'POST',
		success: function() {
			alert("success")
		}
	})
	alert("Submission Successful!");
}
