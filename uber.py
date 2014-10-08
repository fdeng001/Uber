
from flask import Flask, request, jsonify, render_template
import requests, json

APP_TOKEN = "egCeE3gSo3QkyTLtBEAsGpnZZ"
API_URL = "http://data.sfgov.org/resource/rqzj-sfat.json"

app = Flask(__name__)

@app.route("/")
def index():
	return render_template('index.html')

@app.route("/hello")
def hello():
	params = {
		'$$app_token': APP_TOKEN,
		'$where': 'blocklot > \'3711017\' AND blocklot < \'3711019\'',
	}

	r = requests.get(API_URL, params=params)

	return r.content

@app.route("/foodtrucks", methods = ['GET'])
def foodtrucks():
	# print request.args
	startLat = float(request.args.get('startLat'))
	startLng = float(request.args.get('startLng'))
	endLat = float(request.args.get('endLat'))
	endLng = float(request.args.get('endLng'))

	data = []

	if startLat and startLng and endLat and endLng:

		apiUrl = "http://data.sfgov.org/resource/rqzj-sfat.json"

		# In an attempt to make more uniform the locations returned,
		# the coordinates will be split up into grids.

		def generateBoolean(startLat, endLat, startLng, endLng):
			return 'latitude > ' + str(startLat) + ' AND ' + \
				   'latitude < ' + str(endLat) + ' AND ' + \
				   'longitude > ' + str(startLng) + ' AND ' + \
				   'longitude < ' + str(endLng)

		numGrids = 2
		latLen = (endLat - startLat) / float(numGrids)
		lngLen = (endLng - startLng) / float(numGrids)

		lat1 = startLat
		lng1 = startLng
		for i in range(numGrids):
			lat2 = lat1 + latLen
			for j in range(numGrids):
				lng2 = lng1 + lngLen

				lat_lng_boolean = generateBoolean(lat1, lat2, lng1, lng2)
				print lat_lng_boolean

				params = {
					'$$app_token': APP_TOKEN,
					'$where': lat_lng_boolean,
					'$limit': 10,
				}

				r = requests.get(API_URL, params=params)

				data += json.loads(r.content)

				# move over the lng grid
				lng1 += lngLen
			# move over the lat grid
			lat1 += latLen

		# print data
		return json.dumps(data)

	return 'One or More Arguments [startLat,startLng,endLat,endLng] Missing', 501

if __name__ == "__main__":
	app.run(debug=True)





















