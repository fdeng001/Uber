
function calcDistanceFromLatLongPair(lat1, lng1, lat2, lng2) {
	var earthRadius = 6371;
}

function formatPosition(lat, lng) {
	lat = lat.toFixed(4);
	lng = lng.toFixed(4);
	return '(' + lat + ', ' + lng + ')';
}

function getTrucks(neLat, neLng, swLat, swLng) {
	$.ajax({
		type: 'GET',
		url: '/foodtrucks',
		data: {
			lat1: swLat,
			lat2: neLat,
			lng1: swLng,
			lng2: neLng,
		}
	}).success(function(msg) {
		//debug_flag && console.log('success: '+msg);
		return $.parseJSON(msg);
	}).error(function(err) {
		console.log('error: '+err);
	});
}

function showLoader() {
	//
}
function hideLoader() {
	//
}














