$(document).ready(function(){


	var infowindow = null;
	var pos;
	var userCords;
	var allLatlng = []
	var tempMarkerHolder = []


	//function from github for greatcircle distance


     function distance(lat1, lon1, lat2, lon2) {
        lat1 *= Math.PI / 180;
        lon1 *= Math.PI / 180;
        lat2 *= Math.PI / 180;
        lon2 *= Math.PI / 180;
        var lonDelta = lon2 - lon1;
        var a = Math.pow(Math.cos(lat2) * Math.sin(lonDelta) , 2) + Math.pow(Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lonDelta) , 2);
        var b = Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(lonDelta);
        var angle = Math.atan2(Math.sqrt(a) , b);
		return angle * 6371.009;
    }



		//Start geolocation
		
		if (navigator.geolocation) {    
		
			function error(err) {
				console.warn('ERROR(' + err.code + '): ' + err.message);
			}
			
			function success(pos){
				userCords = pos.coords;
				
				//return userCords;
			}
		
			// Get the user's current position
			navigator.geolocation.getCurrentPosition(success, error);
			//console.log(pos.latitude + " " + pos.longitude);
			} else {
				alert('Geolocation is not supported in your browser');
			}
		
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
		zoomControl:true,
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


function codeAddress() {
  var address = document.getElementById('address').value;
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
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



	$('#chooseZip').submit(function(){ //bind function to submit event of form

		//delete old markers
		for (var i = 0; i < tempMarkerHolder.length; i++ ) {
    		tempMarkerHolder[i].setMap(null);
  		}
  		tempMarkerHolder.length = 0;


  		allLatlng=[]


		var userPostalCode = $("#textZip").val();
		console.log(places)
		console.log(userPostalCode)

		var geocoder = new google.maps.Geocoder();
	

	geocoder.geocode( { 'address': userPostalCode, 'region':'ca'}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {

    	var userLatLon={'lat':results[0].geometry.location.A ,
    					'lon': results[0].geometry.location.F 
    				};	
     
      
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
      var userLatLon=postalCodes[userPostalCode]
    }






//find the closest places

		var closestPlaces = []
		i=0
		while (closestPlaces.length<5){
			if( places[i].number==1 && places[i].food=='food' ){
				closestPlaces.push(places[i])
				closestPlaces[closestPlaces.length-1].distance=distance(userLatLon.lat,userLatLon.lon,
					places[i].latitude, places[i].longitude);
			}
			i++

		}

		//console.log(closestPlaces)


		maxPlaceDistance={
				distance:closestPlaces[0].distance
				,index:0
			};

			
		for (i; i<places.length; i++){
			
			if(places[i].number==1 && places[i].food=='food'){
			//	console.log('places '+ i)

			maxPlaceDistance.distance=closestPlaces[0].distance;
			maxPlaceDistance.index=0;
			

				for(j=0;j<closestPlaces.length;j++){
					placeDistance=closestPlaces[j].distance;
					if(placeDistance>maxPlaceDistance.distance){
						maxPlaceDistance.distance=placeDistance;
						maxPlaceDistance.index=j;
					}
				}

				placeDistance=distance(userLatLon.lat,userLatLon.lon, places[i].latitude,
				 places[i].longitude);
			//console.log('prev max:' +  maxPlaceDistance.distance + ' current: ' + placeDistance)
				if(placeDistance<maxPlaceDistance.distance){
					//console.log('new top 10!')
					//console.log(closestPlaces[maxPlaceDistance.index]);
					// console.log(places[i]);

					closestPlaces[maxPlaceDistance.index]=places[i];
					

					closestPlaces[maxPlaceDistance.index].distance=placeDistance;
					//console.log(closestPlaces[maxPlaceDistance.index]);
				}
			}
		}


		
//end find the closest places



//for each closest place plot it
		for (i=0; i< closestPlaces.length;i++){
		theClosestPlace=closestPlaces[i]
		//console.log(theClosestPlace);

	


		myLatLng =  new google.maps.LatLng(theClosestPlace.latitude,theClosestPlace.longitude);

		// console.log(myLatLng)

		allMarkers = new google.maps.Marker({
			position:myLatLng
			,map:map
			,title:theClosestPlace.name
			,html:
					'<div class="markerPop">' +
					'<h1>' + theClosestPlace.name +'</h1>' +
					'<h3>' + theClosestPlace.address + ' (' +
					 theClosestPlace.distance.toFixed(2) + 'KM) </h3>' +

					'<h3>' + theClosestPlace.list_name +'</h3>' +
					
					'<p>' + theClosestPlace.description + '</p>' +
					'<p>' + theClosestPlace.website +'</p>' +
					'</div>'
		});
		console.log(allMarkers)

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
			,title:theClosestPlace.name
			,html:
					'<div class="markerPop">' +
					'<h1>Your Location</h1>' +
					
					'</div>'
		});

		console.log(allMarkers)

		//put all lat long in array
		allLatlng.push(myLatLng);
								
		//Put the marketrs in an array
		tempMarkerHolder.push(allMarkers);













	console.log(closestPlaces)







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
			
		

		
	});












return false;// important: prevent form from submitting






  });



		

	
 places = (function () {
    var json = null;
    $.ajax({
        'async': false,
        'global': false,
        // 'url': '/2tweets.json',
        'url': '/data/data.json',
        'dataType': "json",
        'success': function (data) {
            json = data;
        }
    });
    return json;
})(); 

	
 postalCodes = (function () {
    var json = null;
    $.ajax({
        'async': false,
        'global': false,
        // 'url': '/2tweets.json',
        'url': '/data/postalCodes.json',
        'dataType': "json",
        'success': function (data) {
            json = data;
        }
    });
    return json;
})(); 

// console.log(json)

});