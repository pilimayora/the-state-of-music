// initializing county map
var countyMap = L.map('countymap')

// defining basemap
const url = "http://{s}tile.stamen.com/toner-lite/{z}/{x}/{y}.png";
const basemap = L.tileLayer(url, {
  subdomains: ['', 'a.', 'b.', 'c.', 'd.'],
  minZoom: 0,
  format: 'png',
  opacity: 1,
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
});

//adding base map to div
basemap.addTo(countyMap);

//creating info box
var info = L.control();

info.onAdd = function(map) {
  this._div = L.DomUtil.create('div', 'county-info');
  this.update();
  this.update_undef();
  return this._div;
}

//used by later function and second popup
var maxRank = 0;

info.update = function(props, infoType) {
  if (infoType == 'all') {
    this._div.innerHTML = (props ? "<h4>" + props.NAME + " " + props.LSAD + " (" + props.state_abbr + ")" + "</h4>" +
      "<table><tr><td> Top Genre:</td><td class='titleCase'>" + props.dom_genre + "</td></tr>" +
      "<tr><th class='center'>Genre</th><th class='center'>No. of shows</th></tr>" +
      "<tr><td class='left'><div class='legend-color pop'></div>Pop</td><td>" + props.num.pop + "</td></tr>" +
      "<tr><td class='left'><div class='legend-color rock'></div>Rock</td><td>" + props.num.rock + "</td></tr>" +
      "<tr><td class='left'><div class='legend-color hip-hop'></div>Hip Hop</td><td>" + props.num.hip_hop + "</td></tr>" +
      "<tr><td class='left'><div class='legend-color rnb'></div>R&B</td><td>" + props.num.rnb + "</td></tr>" +
      "<tr><td class='left'><div class='legend-color classical_jazz'></div>Classical & Jazz</td><td>" + props.num.classical_and_jazz + "</td></tr>" +
      "<tr><td class='left'><div class='legend-color electronic'></div>Electronic</td><td>" + props.num.electronic + "</td></tr>" +
      "<tr><td class='left'><div class='legend-color country_folk'></div>Country & Folk</td><td>" + props.num.country_and_folk + "</td></tr>" +
      "</table>" +
      "<small>(click to zoom)</small>" :
      '<h4>Hover over a county</h4>')
  } else {
    this._div.innerHTML = (props ? "<h4>" + props.NAME + " " + props.LSAD + " (" + props.state_abbr + ")" + "</h4>" +
      "<table><tr><th>Rank:</th><td>" + props.rank_label + " out of " + maxRank + "</td></tr>" +
      "<th>Number of upcoming " + GENRES[current_genre].label + " shows</th><td>" + props.num + "</td></table>" +
      "<small>(click to zoom)</small>" :
      '<h4>Hover over a county</h4>')
  };
}

info.update_undef = function(props) {
  this._div.innerHTML = (props ? "<h4>" + props.NAME + " " + props.LSAD + " (" + props.state_abbr + ")" + "</h4>" +
    "<table><tr><td>No upcoming shows</td><td></table>" : '<h4>Hover over a county</h4>')
}

// defining style for state boundaries
function state_style() {
  return {
    color: "#fff",
    weight: 3,
  }
}

// creating state boundaries
function getStateLines() {
  return L.geoJson(states_geo, {
    style: state_style,
    onEachFeature: function(feature, layer) {
      layer.myTag = "myStates"
    }
  });
}


function county_mouseover(e) {
  var layer = e.target;

  if (layer.feature.properties.value || layer.feature.properties.ranking) {
    layer.bringToFront();
    layer.setStyle({
      fillOpacity: 1,
      color: "#ffffff",
      weight: 2
    });
    //this is a slightly awkward solution to the issue of using objects within the info.update function
    //this determines whether the function is targetting an 'all genres' or single genres polygons
    //and sends this to the info.update function
    //alternatively we could use the current_genre global variable, but I'm trying to limit the use of that to within the legend boxes
    var infoType
    if (typeof(layer.feature.properties.num) == 'object') {
      infoType = 'all'
    } else {
      infoType = 'single'
    };

    info.update(layer.feature.properties, infoType);
  } else {
    info.update_undef(layer.feature.properties)
  }
}


function county_mouseout(e) {
  var layer = e.target;
  if (layer.feature.properties.value || layer.feature.properties.ranking) {
    layer.setStyle({
      fillOpacity: 0.7,
      color: "#ffffff",
      weight: 1
    });
  }
  info.update()
}

// function to remove counties and states when zoom to city
function removeLayers() {
  return countyMap.eachLayer(function(layer) {
    if (layer.myTag === "myCounties" || layer.myTag === "myStates" || layer.myTag === "myVenues") {
      countyMap.removeLayer(layer)
    }

  });
}


function zoomToCity(e) {
  genre = current_genre
  var layer = e.target
  current_county = layer.feature.properties.NAME;
  countyMap.fitBounds(e.target.getBounds());
  countyMap.removeControl(info)

  removeLayers()
  d3.selectAll("svg#stats > *").remove();
  usVenues.draw(current_genre)
  venueInfo.addTo(countyMap)
  if (genre != "top") {
    stats.draw(genre)
  } else {
    stats.top("top")
  }
  //level = 'venue'
  updateInfoBox(current_county);
  updateSums(genre)
  //this change to current_state has been added so that if the user clicks a county in  a
  //different state to their original choice, when they go back it will zoom out to the new one
  current_state = layer.feature.properties.state_abbr;
}

//'Go Back' button
var button = new L.Control.Button('Back to previous level', {
  position: 'bottomleft',
});

button.addTo(countyMap);

button.on('click', function() {

  d3.selectAll("svg#stats > *").remove();

  if (geo_level == 'venue') {
    //this is taken from uStates.js - could be turned into a seperate function used by both for efficiency
    var state_abbr = current_state;
    var state_bbox = get_state_bbox(state_abbr);
    countyMap.removeControl(venueInfo)
    usCounties.draw(state_bbox, current_genre); //function that draws leaflet
    geo_level = 'county';
    updateInfoBox(current_state)
    updateSums(current_genre)
  } else {
    ////this is also adapated from uStates.js
    // removing state map and statistics
    d3.selectAll("svg#statesvg > *").remove();
    // adding new maps depending on geo_level
    $("#countymap").toggle();
    geo_level = "state";
    uStates.draw(current_genre);
    updateInfoBox();
    updateSums(current_genre)
  }

  // adding stats
  if (current_genre == "top") {
    stats.top("top");
  } else {
    stats.draw(current_genre)
  }
  //Ensuring venue popup has been removed
  //countyMap.removeControl(venueInfo)
});

// defining popups and county style on hover
function onEachFeature(feature, layer, genre) {
  layer.myTag = "myCounties" // tagging county polygons for removeLayers() function

  layer.on({
    mouseover: county_mouseover,
    mouseout: county_mouseout,
    click: zoomToCity,
  });
}

// defining style for county choropleth
function county_style() {
  return {
    color: "#dddddd",
    weight: 1,
    fillOpacity: 0.7,
  }
}

function getChoropleth(genre) {
  var choropleth = L.choropleth(counties_geo, {
    valueProperty: "value",
    fillColor: "#aaadb2",
    scale: [GENRES[genre].color, "white"],
    steps: 10,
    mode: "e", // e for equidistant
    style: county_style,
    onEachFeature: onEachFeature
  });
  return choropleth;
}

function cat_style(feature) {
  return {
    fillColor: domgenre_colors(feature.properties.value), // refer helpers.js
    weight: 1,
    color: "#ffffff",
    fillOpacity: 0.7
  }
}

function getCategorical() {
  var categorical = L.geoJson(counties_geo, {
    style: function(feature) {
      return cat_style(feature)
    },
    onEachFeature: onEachFeature
  });
  return categorical;
}

var usCounties = {};

function drawLayers(genre) {
  const params = jQuery.param({
    genre: genre,
    admin_level: 2
  });
  var request_url = "search?" + params;

  d3.json(request_url, function(error, data) {
    if (error) console.log(error);
    data = data['data']

    for (var i = 0; i < data.length; i++) {
      var counties_geo_index = counties_geo.features.findIndex(function(f) {
        return +f.properties.STATE == data[i].state_code &&
          +f.properties.COUNTY == data[i].county_code
      });

      if (counties_geo_index != -1) {
        //adding state abbr
        counties_geo.features[counties_geo_index].properties.state_abbr = data[i].state_abbr;
        if (genre == "top") {
          counties_geo.features[counties_geo_index].properties.value = data[i].dom_genre;
          //I've had to leave the previous line attributing dom_genre to the value attribute
          //because it's used to colour the polygons
          //dom_genre_label is the cleaned version without underscores etc.
          var dom_genre_label
          if (GENRES[data[i].dom_genre]) {
            dom_genre_label = (GENRES[data[i].dom_genre]["label"])
          } else {
            dom_genre_label = "none"
          };
          counties_geo.features[counties_geo_index].properties.dom_genre = dom_genre_label;

          //if the genre is set to top, this will go through the GENRES list and add all nums to an array
          var numField = {}
          for (genreCat in GENRES) {
            numGenre = genreCat + "_num";
            numField[genreCat] = [data[i][numGenre]];
          };
        } else {
          counties_geo.features[counties_geo_index].properties.value = data[i].ranking;
          //adding a rank label (the value field is used for colouring polys and so can't be edited)
          //since we can't target props inside the wider popup function this is a work around
          for (key in data) {
            if (data[key].ranking > maxRank) {
              maxRank = data[key].ranking;
            }
          }
          if (data[i].ranking > maxRank) {
            counties_geo.features[counties_geo_index].properties.rank_label = 0
          } else {
            counties_geo.features[counties_geo_index].properties.rank_label = data[i].ranking
          };
          //if view is single genre, it passes a single integer instead
          var numField
          numGenre = genre + "_num";
          numField = data[i][numGenre];
        }
        //either way, the new variable is added to the object
        counties_geo.features[counties_geo_index].properties.num = numField;

      }
    }

    if (genre != "top") {
      var choropleth = getChoropleth(genre);
      choropleth.addTo(countyMap);
    } else {
      var categorical = getCategorical();
      categorical.addTo(countyMap);
    }

    var stateLines = getStateLines();
    stateLines.addTo(countyMap);

    info.addTo(countyMap)

  });
}

usCounties.draw = function(bbox, genre) {
  // resetting geo_level
  geo_level = "county";
  removeLayers();

  countyMap.fitBounds(bbox);
  drawLayers(genre);
}

usCounties.recalculateGenres = function(genre) {
  removeLayers();
  drawLayers(genre);
}

this.usCounties = usCounties
