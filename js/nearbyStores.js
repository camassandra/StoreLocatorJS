var info = document.getElementById('info'),
 request = {
    location: null,
    types: null
  },
  places = [],
  markers = [],
  infowindows = [],
  user = {
	position: {
		latitude: null,
		longitude: null
	}

};

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getPosition);
        //info.innerHTML = "Geolocation is working!!!";
    } else { 
    	info.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function getPosition(position) {
    user.position.latitude = position.coords.latitude 
    user.position.longitude = position.coords.longitude;
    initMap(user.position.latitude, user.position.longitude);
}
var setMarker = function(map,latitude, longitude){
	console.log('latitude user: ', latitude)
	var marker = new google.maps.Marker({
          map: map,
          position: {
          	lat: latitude,
          	lng: longitude
          },
          title: 'You are Here bitch',
          icon: 'https://maps.google.com/mapfiles/kml/shapes/info-i_maps.png',

        })
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
  setMarker(map, latitude, longitude);
  console.log('map is ', map);
  searchShops(userLocation, map);
  //Resize Function
		google.maps.event.addDomListener(window, "resize", function() { //on event 'resize'
			var centraLocation = map.getCenter();
			google.maps.event.trigger(map, "resize");
			map.setCenter(centraLocation);
		});
}

 

  // Create the PlaceService and send the request.
  // Handle the callback with an anonymous function.
  var checkRating = function(res,n){
  	console.log('rating: ', res[n].rating)
  	if(res[n].rating){
  		  	console.log('rating 2: ', res[n].rating)

  		return '</br>' + res[n].rating 
  	}
  	else{
  		return "Not provided";
  	}
  };

  function searchShops(userLocation, map){
  	 console.log('user location in searchShops ', userLocation);
	  	// Specify location, radius and place types for your Places API search.
	  request = {
	    location: userLocation,
	    rankby: google.maps.places.RankBy.DISTANCE, 
	    radius: "500",
	    types: ['store']
	  };
  	var service = new google.maps.places.PlacesService(map),
  	    contentList = '<tr><th>Business Name</th><th>Address</th><th>Rating</th><th>Distance</th></tr>';

  	service.search(request, function(results, status) {
  	console.log('status is ', status);
    if (status == google.maps.places.PlacesServiceStatus.OK) {
    	console.log('results are ', results.length, results);
      for (var i = 0; i < results.length; i++) {
        // If the request succeeds, draw the place location on
        // the map as a marker, and register an event to handle a
        // click on the marker.
        var marker = new google.maps.Marker({
          map: map,
          position: results[i].geometry.location
        });
        markers.push(marker); 
            var infowindow = new google.maps.InfoWindow(),
			openedInfoHistory = [],
            content = '<div><strong>' + results[i].name + '</strong><br>' +
           'Address: ' + results[i].vicinity +" " + checkRating(results,i) + '</div>';
            contentList+='<tr>'+ '<td>' + "<a href='javascript:google.maps.event.trigger(markers["+(markers.length-1)+"],\"click\");'>"+ results[i].name + '</a>' + '</td>' + '<td>' + results[i].vicinity + '</td>' + '<td>' + 
            checkRating(results,i) + '</td>'+'<td>'+ google.maps.geometry.spherical.computeDistanceBetween(userLocation, results[i].geometry.location).toFixed(2) +'</td>';



		google.maps.event.addListener(marker,'click', (function(marker,content,infowindow){ 
             	console.log("Distance: ",google.maps.geometry.spherical.computeDistanceBetween(userLocation, results[i].geometry.location).toFixed(2))

	        return function() {
 				openedInfoHistory.push (infowindow);//can be used to check what has been clicked
			  	console.info ("open history: ",openedInfoHistory);

				for (var k =0; k<openedInfoHistory.length;k++){
					openedInfoHistory[k].close();
				}
						console.info ("infowindows");

	           infowindow.setContent(content);
	           infowindow.open(map,marker);
	        };
	    })(marker,content,infowindow)); 

      map.panTo(results[i].geometry.location);
      }
      document.getElementById('results').innerHTML = contentList;

 
		sortTable('results',3,'disc');

    }
  })
  };

     function sortTable(table, column, order){
    var tbl = document.getElementById(table).tBodies[0];
    var store = [];
    console.info (tbl.rows.length)
    for(var i=0, len=tbl.rows.length; i<len; i++){
        var row = tbl.rows[i];
        var sortnr = parseFloat(row.cells[column].textContent || row.cells[column].innerText);
        if(!isNaN(sortnr)) store.push([sortnr, row]);
    }
    store.sort(function(x,y){
    	if (order == 'asc'){
     	   return x[0] - y[0];
    	}else{
    		return y[0] - x[0];
    	}
    });
    for(var i=0, len=store.length; i<len; i++){
        tbl.appendChild(store[i][1]);
    }
    store = null;
}
  

// Run the initialize function when the window has finished loading.
google.maps.event.addDomListener(window, 'load', getLocation);