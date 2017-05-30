var info = document.getElementById('info'),
 request = {
    location: null,
    radius: null,
    types: null
  },
 user = {
	position: {
		latitude: null,
		longitude: null
	}

};

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getPosition);
        info.innerHTML = "Geolocation is working!!!";
    } else { 
    	info.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function getPosition(position) {
    user.position.latitude = position.coords.latitude 
    user.position.longitude = position.coords.longitude;
    initMap(user.position.latitude, user.position.longitude);
}


function initMap(latitude, longitude) {
  var userLocation = new google.maps.LatLng(user.position.latitude, user.position.longitude);
  console.log('user position ', user.position);
  console.log('user location ', userLocation);

  var map = new google.maps.Map(document.getElementById('map'), {
    center: userLocation,
    zoom: 15,
    scrollwheel: false
  });
  console.log('map is ', map);
  searchShops(userLocation, map);
}

 

  // Create the PlaceService and send the request.
  // Handle the callback with an anonymous function.
  
  function searchShops(userLocation, map){
  	 console.log('user location in searchShops ', userLocation);
	  	// Specify location, radius and place types for your Places API search.
	  request = {
	    location: userLocation,
	    radius: '500',
	    types: ['store']
	  };
  	var service = new google.maps.places.PlacesService(map);
  	service.nearbySearch(request, function(results, status) {
  	console.log('status is ', status);
    if (status == google.maps.places.PlacesServiceStatus.OK) {
    	console.log('results are ', results);
      for (var i = 0; i < results.length; i++) {
        var place = results[i];
        // If the request succeeds, draw the place location on
        // the map as a marker, and register an event to handle a
        // click on the marker.
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location
        });
      }
    }
  })
  };
  

// Run the initialize function when the window has finished loading.
google.maps.event.addDomListener(window, 'load', getLocation);