
var map;
var exampleMarker;
var foodTruckIcon = "/static/img/food-truck-v2.png";
var pushCartIcon = "/static/img/push-cart-v2.png";
var existingMarkers = {};
var infowindow;

function dropTruckMarkers() {
	var neLat = map.getBounds().getNorthEast().lat();
	var neLng = map.getBounds().getNorthEast().lng();
	var swLat = map.getBounds().getSouthWest().lat();
	var swLng = map.getBounds().getSouthWest().lng();

	// debug_flag && console.log('NorthEast Bound: ' + formatPosition(neLat, neLng));
	// debug_flag && console.log('SouthWest Bound: ' + formatPosition(swLat, swLng));

	$.ajax({
		type: 'GET',
		url: '/foodtrucks',
		data: {
			startLat: swLat,
			endLat: neLat,
			startLng: swLng,
			endLng: neLng,
		}
	}).success(function(msg) {
		// debug_flag && console.log('success: '+msg);
		var trucks = $.parseJSON(msg);

		var i = 0;
		var numNewMarkers = 0;

		$.each(trucks, function() {
			var address = this['address'];
			var applicant = this['applicant'];
			var facilityType = this['facilitytype'];
			var foodItems = this['fooditems'];
			var latitude = parseFloat(this['latitude']);
			var longitude = parseFloat(this['longitude']);

			var markerIcon;
			if (facilityType == 'Push Cart') {
				markerIcon = pushCartIcon;
			} else { // use default of type 'Truck'
				markerIcon = foodTruckIcon;
			}

			var markerId = applicant + '|||' + address;
			if (existingMarkers[markerId] == undefined) { // only process if we haven't seen this one before
				numNewMarkers++;

				var markerPosition = new google.maps.LatLng(latitude, longitude);

				var facilityTypeHTML;
				if (facilityType == 'Push Cart') {
					facilityTypeHTML = '<span class="marker-otherFacilityType">Truck</span>'
										+ '<span class="marker-facilityType">Push Cart</span>';
				} else {
					facilityTypeHTML = '<span class="marker-facilityType">Truck</span>'
										+ '<span class="marker-otherFacilityType">Push Cart</span>';
				}

				// Should have used a templating engine like Mustache.js but I was running
				// into some issues that I didn't think was worth trying to solve in the time
				// that I had.
				var markerContent = '<h3 class="marker-applicant">' + applicant + '</h1>'
									+ '<p class="marker-address">' + address + '</p>'
									+ '<p class="marker-facilityContainer">'
									+ facilityTypeHTML
									+ '</p>'
									+ '<p class="marker-foodItems">' + foodItems + '</p>';
				
				
				existingMarkers[markerId] = true; // add to hash so we don't process same location next time

				// animation effect
				// animation: google.maps.Animation.DROP,
				setTimeout(function() {					

					var marker = new google.maps.Marker({
						position: markerPosition,
						icon: markerIcon,
						map: map,
						title: applicant,
					});

					google.maps.event.addListener(marker, 'click', function() {
						if (infowindow)
							infowindow.close(); // always only have 1 infowindow open

						var options = {
							map: map,
							position: markerPosition,
							content: markerContent
						};

						infowindow = new google.maps.InfoWindow(options);

						//map.setCenter(markerPosition);
					});
				}, i++ * 50);

				// debug_flag && console.log('New Marker: ' + formatPosition(latitude,longitude));
			} else {
				// marker has already been added
			}
			// all markers loaded
			$("#loader").hide();
		});
		// debug_flag && console.log('# Markers Added: ' + numNewMarkers);
	}).error(function(err) {
		console.log('error: '+err);
	});
}

function initialize() {
	var mapOptions = {
		zoom: 13
	};
	map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

	// var input = document.getElementById('search-input');
	// map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

	var addressField = document.getElementById('search-input');
	var geocoder = new google.maps.Geocoder();
	function search() {
		geocoder.geocode(
			{'address': addressField.value}, 
			function(results, status) { 
				if (status == google.maps.GeocoderStatus.OK) { 
					var loc = results[0].geometry.location;
					map.setCenter({lat: loc.lat(), lng: loc.lng()});
				} 
				else {
					alert("Not found: " + status); 
				} 
			}
		);
	};
	
	$("#search-button").click(function() { // for pressing search button directly
		console.log('Hi');
		search();
	});
	$("#search-input").on("keypress", function(e) { // for pressing enter in search box
		if (e.keyCode == 13) {
			search();
		}
	});

	if(navigator.geolocation) { // this code from https://developers.google.com/maps/documentation/javascript/examples/map-geolocation
		navigator.geolocation.getCurrentPosition(function(position) {
			var pos = new google.maps.LatLng(position.coords.latitude,
											 position.coords.longitude);
			map.setCenter(pos);
		}, function() {
			handleNoGeolocation(true);
		});
	} else {
		handleNoGeolocation(false);
	}

	function handleNoGeolocation(errorFlag) {
		if (errorFlag) {
			var content = 'Error: The Geolocation service failed.';
		} else {
			var content = 'Error: Your browser doesn\'t support geolocation.';
		}

		var options = {
			map: map,
			position: new google.maps.LatLng(37.790, -122.399), // SF
			content: content
		};

		var infowindow = new google.maps.InfoWindow(options);
		map.setCenter(options.position);
	}

	// example info window
	var examplePosition = new google.maps.LatLng(37.790, -122.399);
	var exampleContent = ["feel","my","legs"].join("<br>");
	var exampleInfoWindow = new google.maps.InfoWindow();
	
	/*
	exampleInfoWindow.setPosition(examplePosition);
	exampleInfoWindow.setContent(exampleContent);
	exampleInfoWindow.open(map);
	*/
	
	google.maps.event.addListener(map, 'bounds_changed', function() {

		$("#loader").show();

		var neLat = map.getBounds().getNorthEast().lat();
		var neLng = map.getBounds().getNorthEast().lng();
		var swLat = map.getBounds().getSouthWest().lat();
		var swLng = map.getBounds().getSouthWest().lng();

		setTimeout(function() {
			var neLatNew = map.getBounds().getNorthEast().lat();
			var neLngNew = map.getBounds().getNorthEast().lng();
			var swLatNew = map.getBounds().getSouthWest().lat();
			var swLngNew = map.getBounds().getSouthWest().lng();
			if ((neLatNew == neLat) || (neLngNew == neLng) || (swLatNew == swLat) || (swLngNew == swLng)) {
				// Only if the bounds have stayed in the same position for
				// at least 0.5s do we drop new markers, since it is expensive to call too much.
				dropTruckMarkers();
			}
		}, 500);
	});

	// will hide the info window if zoomed out too much
	// google.maps.event.addListener(map, 'zoom_changed', function(i) {
}

google.maps.event.addDomListener(window, 'load', initialize);






















