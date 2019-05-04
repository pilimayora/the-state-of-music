import requests
import datetime
import mysql.connector as mysql
import configparser

config = configparser.ConfigParser()
config.read('../config.ini')

db = mysql.connect(
    host=config['mysql']['host'],
    user=config['mysql']['user'],
    passwd=config['mysql']['pass'],
    database="state_of_music"
)

cursor = db.cursor()

base_url = "https://www.eventbriteapi.com/v3/"

us_states = [
            ["WY",  -111.056888,    40.994746,      -104.05216,     45.005904],
            ["WI",  -92.888114,     42.491983,      -86.805415,     47.080621],
            ["WV",  -82.644739,     37.201483,      -77.719519,     40.638801],
            ["WA",  -124.763068,    45.543541,      -116.915989,    49.002494],
            ["VA",  -83.675395,     36.540738,      -75.242266,     39.466012],
            ["VT",  -73.43774,      42.726853,      -71.464555,     45.016659],
            ["UT",  -114.052962,    36.997968,      -109.041058,    42.001567],
            ["TX",  -106.645646,    25.837377,      -93.508292,     36.500704],
            ["TN",  -90.310298,     34.982972,      -81.6469,       36.678118],
            ["SD",  -104.057698,    42.479635,      -96.436589,     45.94545],
            ["SC",  -83.35391,      32.0346,        -78.54203,      35.215402],
            ["RI",  -71.862772,     41.146339,      -71.12057,      42.018798],
            ["PA",  -80.519891,     39.7198,        -74.689516,     42.26986],
            ["OR",  -124.566244,    41.991794,      -116.463504,    46.292035],
            ["OK",  -103.002565,    33.615833,      -94.430662,     37.002206],
            ["OH",  -84.820159,     38.403202,      -80.518693,     41.977523],
            ["ND",  -104.0489,      45.935054,      -96.554507,     49.000574],
            ["NC",  -84.321869,     33.842316,      -75.460621,     36.588117],
            ["NY",  -79.762152,     40.496103,      -71.856214,     45.01585],
            ["NM",  -109.050173,    31.332301,      -103.001964,    37.000232],
            ["NJ",  -75.559614,     38.928519,      -73.893979,     41.357423],
            ["NH",  -72.557247,     42.69699,       -70.610621,     45.305476],
            ["NV",  -120.005746,    35.001857,      -114.039648,    42.002207],
            ["NE",  -104.053514,    39.999998,      -95.30829,      43.001708],
            ["MT",  -116.050003,    44.358221,      -104.039138,    49.00139],
            ["MO",  -95.774704,     35.995683,      -89.098843,     40.61364],
            ["MS",  -91.655009,     30.173943,      -88.097888,     34.996052],
            ["MN",  -97.239209,     43.499356,      -89.491739,     49.384358],
            ["MI",  -90.418136,     41.696118,      -82.413474,     48.2388],
            ["MA",  -73.508142,     41.237964,      -69.928393,     42.886589],
            ["MD",  -79.487651,     37.911717,      -75.048939,     39.723043],
            ["ME",  -71.083924,     42.977764,      -66.949895,     47.459686],
            ["LA",  -94.043147,     28.928609,      -88.817017,     33.019457],
            ["KY",  -89.571509,     36.497129,      -81.964971,     39.147458],
            ["KS",  -102.051744,    36.993016,      -94.588413,     40.003162],
            ["IA",  -96.639704,     40.375501,      -90.140061,     43.501196],
            ["IN",  -88.09776,      37.771742,      -84.784579,     41.760592],
            ["IL",  -91.513079,     36.970298,      -87.494756,     42.508481],
            ["ID",  -117.243027,    41.988057,      -111.043564,    49.001146],
            ["HI",  -178.334698,    18.910361,      -154.806773,    28.402123],
            ["GA",  -85.605165,     30.357851,      -80.839729,     35.000659],
            ["FL",  -87.634938,     24.523096,      -80.031362,     31.000888],
            ["DC",  -77.119759,     38.791645,      -76.909395,     38.99511],
            ["DE",  -75.788658,     38.451013,      -75.048939,     39.839007],
            ["CT",  -73.727775,     40.980144,      -71.786994,     42.050587],
            ["CO",  -109.060253,    36.992426,      -102.041524,    41.003444],
            ["CA",  -124.409591,    32.534156,      -114.131211,    42.009518],
            ["AR",  -94.617919,     33.004106,      -89.644395,     36.4996],
            ["AZ",  -114.81651,     31.332177,      -109.045223,    37.00426],
            ["AK",  -179.148909,    51.214183,      -128,           73],
            ["AL",  -88.473227,     30.223334,      -84.88908,      35.008028]
            ]

today = datetime.datetime.today()
date_range = [today + datetime.timedelta(days=x) for x in range(0, 30)]
start_date = date_range[0].strftime("%Y-%m-%d"+"T00:00:00Z")
end_date = date_range[-1].strftime("%Y-%m-%d"+"T23:59:59Z")

token = config['eventbrite']['token']
categories = '103'  # music
formats = '6'  # concerts and performances

for us_state in us_states:
    params = {'token': token,
              'categories': categories,
              'formats': formats,
              'location.viewport.northeast.latitude': us_state[4],
              'location.viewport.northeast.longitude': us_state[3],
              'location.viewport.southwest.latitude': us_state[2],
              'location.viewport.southwest.longitude': us_state[1],
              'start_date.range_start': start_date,
              'start_date.range_end': end_date,
              }

    r = requests.get(url=base_url + 'events/search/', params=params)

    data = r.json()

    total_events = data['pagination']['object_count']

    if total_events > 0:
        events = data['events']
        for event in events:
            event_id = event['id']
            event_name = event['name']['text']
            event_date = event['start']['local']
            venue_id = event['venue_id']
            subcategory_id = event['subcategory_id']

            venue_url = base_url + 'venues/' + venue_id
            venue_req = requests.get(url=venue_url, params={'token': token})
            venue_data = venue_req.json()

            venue_name = venue_data['name']
            venue_lat = venue_data['latitude']
            venue_long = venue_data['longitude']

            if subcategory_id:
                subcategory_url = base_url + 'subcategories/' + subcategory_id
                subcategory_req = requests.get(
                    url=subcategory_url,
                    params={'token': token}
                )
                subcategory_data = subcategory_req.json()
                subcategory_name = subcategory_data['name']
            else:
                subcategory_name = ''

            query = """INSERT INTO eventbrite_events
                        (eventbrite_id, local_date, event_name,
                        venue_name, venue_lat, venue_long, genre) VALUES
                        (%s, %s, %s, %s, %s, %s, %s)"""
            values = (event_id, event_date, event_name, venue_name,
                      venue_lat, venue_long, subcategory_name)

            cursor.execute(query, values)
            db.commit()
