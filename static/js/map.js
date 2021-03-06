$(document).ready(function(){

   $('#textZip').attr('type','text');
	var infowindow = null;
	var pos;
	var userCords;
	var allLatlng = []
	var tempMarkerHolder = []


		//Start geolocation
		
		// if (navigator.geolocation) {    
		
		// 	function error(err) {
		// 		console.warn('ERROR(' + err.code + '): ' + err.message);
		// 	}
			
		// 	function success(pos){
		// 		userCords = pos.coords;
				
		// 		//return userCords;
		// 	}
		
		// 	// Get the user's current position
		// 	navigator.geolocation.getCurrentPosition(success, error);
		// 	//console.log(pos.latitude + " " + pos.longitude);
		// 	} else {
		// 		alert('Geolocation is not supported in your browser');
		// 	}
		
		//End Geo location




//map options

	var mapOptions = {
		zoom:13,
		// maxZoom: 15,
		center: new google.maps.LatLng(43.67000,-79.4000),
		panControl: false,
		panControlOptions:{
			position:google.maps.ControlPosition.BOTTOM_LEFT
		},
		zoomControl:false,
		zoomControlOptions:{
			style: google.maps.ZoomControlStyle.LARGE,
			position: google.maps.ControlPosition.RIGHT_CENTER
		},
		scaleControl: false
	};

	//Adding infowindow option
	infowindow = new google.maps.InfoWindow({
		content:"holding..."
	});

	//Fire up Google maps and place inside the map-canvas div

	map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);

		//autocomplete options

	autocompleteBottomLeftBound =  new google.maps.LatLng(43.600284,-79.554749);
	autocompleteTopRightBound =  new google.maps.LatLng(43.971075,-79.194946);
	var autocompleteLatLngbound= new google.maps.LatLngBounds(autocompleteBottomLeftBound,
		autocompleteTopRightBound)

	var autocompleteOptions={
		bounds: autocompleteLatLngbound
	};

//push autocompelte result to text
	var autocompleteInput = document.getElementById('textZip');
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(autocompleteInput);
	
		//create autocomplete object	
	var autocomplete = new google.maps.places.Autocomplete(autocompleteInput,
		autocompleteOptions);

//
	var pinColor = "00B300";
	var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
	new google.maps.Size(21, 34),
	new google.maps.Point(0,0),
	new google.maps.Point(10, 34));


	var center;
function calculateCenter() {
  center = map.getCenter();
}
google.maps.event.addDomListener(map, 'idle', function() {
  calculateCenter();
});
google.maps.event.addDomListener(window, 'resize', function() {
  map.setCenter(center);
});


function codeAddress() {
  var address = document.getElementById('address').value;
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
    	console.log('test')
    	console.log(results)
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
      });
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}





function update_map(closestPlaces,userLatLon){

	for (i=0; i< closestPlaces.length;i++){
		theClosestPlace=closestPlaces[i]
		//console.log(theClosestPlace);

		myLatLng =  new google.maps.LatLng(theClosestPlace.lat,theClosestPlace.lng);

		// console.log(myLatLng)

		allMarkers = new google.maps.Marker({
			position:myLatLng
			,map:map
			,title:theClosestPlace.name
			,html:
					'<div class="markerPop">' +
					'<h3>' + theClosestPlace.result.name +'</h3>' +
					'<h4>' + theClosestPlace.result.address + ' (' +
					 (theClosestPlace.distance/1000).toFixed(2) + 'KM) </h4>' +

					'<h5>' + theClosestPlace.result.list_name +'</h5>' +
					
					'<p>' + theClosestPlace.result.description + '</p>' +
					'<p>' + theClosestPlace.result.website +'</p>' +
					'</div>'
		});
		//console.log(allMarkers)

		//put all lat long in array
		allLatlng.push(myLatLng);
								
		//Put the marketrs in an array
		tempMarkerHolder.push(allMarkers);


	}



		myLatLng =  new google.maps.LatLng(userLatLon.lat,userLatLon.lon);

		// console.log(myLatLng)

		allMarkers = new google.maps.Marker({
			position:myLatLng
			,map:map
			,icon:pinImage
			,title:theClosestPlace.result.name
			,html:
					'<div class="markerPop">' +
					'<h4>Your Location</h4>' +
					
					'</div>'
		});

		//console.log(allMarkers)

		//put all lat long in array
		allLatlng.push(myLatLng);
								
		//Put the marketrs in an array
		tempMarkerHolder.push(allMarkers);



		//using paraetrs set aboe, we're adding a click listener to the markers
		for (i=0;i<tempMarkerHolder.length;i++){
			google.maps.event.addListener(tempMarkerHolder[i],'click',function(){
				console.log('test')
				console.log(this.html)
				infowindow.setContent(this.html);
				infowindow.open(map,this);
			});
	 }




//set the zoom and bound level of the map after we plot the points
		var bounds = new google.maps.LatLngBounds();

		for (var i=0 , ltLgLen=allLatlng.length; i< ltLgLen ; i++){
			//and increase the bounds to take this position
			bounds.extend(allLatlng[i]);

		}

		///fit bounds to the map

		map.fitBounds(bounds);
		

}


 google.maps.event.addListener(autocomplete, 'place_changed', function() {
       
    // });  



	// $('#chooseZip').submit(function(){ //bind function to submit event of form

		//delete old markers
		for (var i = 0; i < tempMarkerHolder.length; i++ ) {
    		tempMarkerHolder[i].setMap(null);
  		}
  		tempMarkerHolder.length = 0;


  		allLatlng=[]


		var userPostalCode = $("#textZip").val();
		//console.log(places)
		console.log('User input',userPostalCode)

		var geocoder = new google.maps.Geocoder();




	bottomLeftBound =  new google.maps.LatLng(43.600284,-79.554749);
	topRightBound =  new google.maps.LatLng(43.971075,-79.194946);
	latlngbound= new google.maps.LatLngBounds(bottomLeftBound,topRightBound)

	geocoder.geocode( { 'address': userPostalCode, 'region':'ca', 'bounds':latlngbound }, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {

    	var userLatLon={'lat':results[0].geometry.location.A ,
    					'lon': results[0].geometry.location.F 
    				};	
     
      
    } else {
      // alert('Geocode was not successful for the following reason: ' + status);
      alert('No result, Please try again!');
      // var userLatLon=postalCodes[userPostalCode]
    }

    console.log('userLatLon', userLatLon)
    console.log('stringify userLatLon', JSON.stringify(userLatLon,null,'\t'))




    $.ajax({
    	type:"POST",
    	url:"/",
    	data:JSON.stringify(userLatLon,null,'\t'),
    	contentType: 'application/json;charset=UTF-8',
    	success: function(closestPlaces) {
        console.log(closestPlaces);
        update_map(closestPlaces.json_list,userLatLon)

    }
});


    }
    );

  


 









return false;// important: prevent form from submitting






  });



});