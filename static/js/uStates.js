//sets dimentions
const map_margin = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  map_height = 450 - map_margin.top - map_margin.bottom,
  map_width = 960 - map_margin.left - map_margin.right;
//defining map projection
const projection = d3.geoAlbersUsa()
  .translate([map_width / 2, map_height / 2])
  .scale(1000)

//tells map how to draw the paths from the projection
const map_path = d3.geoPath()
  .projection(projection);

const map = d3.select("#statesvg")
  //Binding the data to the SVG and create one path per json feature
  .selectAll("path")
  .attr("class", "map-path")

const uStates = {};
uStates.draw = function(genre) {

  //Loading in genre data
  const params = jQuery.param({
    genre: genre,
    admin_level: 1,
  });

  var request_url = "search?" + params;
  d3.json(request_url, function(error, data) {
    if (error) console.log(error);
    data = data['data']

    /////////////////////////////////SETTING COLOUR RANGES/////////////////////////////////

    //setting colour range for genres
    var rankings = [];
    for (var index in data) {
      rankings.push(data[index]['ranking']);
    }

    var min = d3.min(rankings);
    var max = d3.max(rankings);

    if (genre != "top") {
      var color_genre = d3.scaleLinear().domain([min, max]).range([GENRES[genre].color, "white"]);
    }

    ///////////////////////////////JOINING GENRE DATA TO JSON//////////////////////////////

    //loading in us json data
    d3.json("https://raw.githubusercontent.com/richa-sud/the-state-of-music-json/master/uStates.json",
      function(json) {
        var states = json.features
        // Looping through each state data value in the .csv file
        for (var i = 0; i < data.length; i++) {
          // Grabing State ID
          var dataState = data[i].state_code;

          var value = ''
          if (genre == 'top') {
            value = data[i].dom_genre;
          } else {
            value = data[i].ranking;
          }

          //I'm keeping this section of code seperate for now to make working it easier
          //This finds the number of shows and passes it on
          //In single genre view it just passes the number of shows for that genre
          //In the top genre view it stores a dictionary of all numbers for each genre
          if (genre == 'top') {
            var numField = {}
            for (genreCat in GENRES) {
              numGenre = genreCat + "_num";
              numField[genreCat] = [data[i][numGenre]];
            };
          } else {
            var numField
            numGenre = genre + "_num";
            numField = data[i][numGenre];
          }

          // Finding the corresponding state inside the JSON
          for (var j = 0; j < states.length; j++) {
            var jsonState = states[j].id;
            if (dataState == jsonState) {
              // Copying all genre scores into the JSON
              states[j].properties.value = value;
              states[j].properties.num = numField;
              // Stop looking through the JSON
              break;
            };
          };
        };
        ///////////////////CREATING SVG ELEMENT AND APPEND MAP TO SVG////////////////////

        //tooptip for top genre page
        function mouseOver_topgenre(d) {
          d3.select("#tooltip")
            .attr("class", "toolTip")
            .transition().duration(300)
            .style("opacity", 0.8)
            .style("left", (d3.event.pageX - 345) + "px")
            .style("top", (d3.event.pageY - 120) + "px");

          var top_genre = ""
          if (d.properties.value) {
            d3.select(this).style("opacity", 1)
            top_genre = GENRES[d.properties.value]["label"];

            d3.select("#tooltip").html(
                "<h4>" + d.properties.name + " (" + d.properties.abbr + ")" + "</h4>" +
                "<table><tr><td> Top Genre:</td><td class='titleCase'>" + top_genre + "</td></tr>" +
                "<tr><th class='center'>Genre</th><th class='center'>No. of shows</th></tr>" +
                "<tr><td class='left'><div class='legend-color pop'></div>Pop</td><td>" + d.properties.num.pop + "</td></tr>" +
                "<tr><td class='left'><div class='legend-color rock'></div>Rock</td><td>" + d.properties.num.rock + "</td></tr>" +
                "<tr><td class='left'><div class='legend-color hip-hop'></div>Hip Hop</td><td>" + d.properties.num.hip_hop + "</td></tr>" +
                "<tr><td class='left'><div class='legend-color rnb'></div>R&B</td><td>" + d.properties.num.rnb + "</td></tr>" +
                "<tr><td class='left'><div class='legend-color classical_jazz'></div>Classical & Jazz</td><td>" + d.properties.num.classical_and_jazz + "</td></tr>" +
                "<tr><td class='left'><div class='legend-color electronic'></div>Electronic</td><td>" + d.properties.num.electronic + "</td></tr>" +
                "<tr><td class='left'><div class='legend-color country_folk'></div>Country & Folk</td><td>" + d.properties.num.country_and_folk + "</td></tr>" +
                "</table>" +
                "<small>(click to zoom)</small>")

          } else {
            d3.select("#tooltip").html(
                "<h4>" + d.properties.name + " (" + d.properties.abbr + ")" + "</h4>" +
                "<table><tr><td> No upcoming shows </td></tr></table>");
          }
        }


        //tooltip for all genres
        function mouseOver_genre(d) {
          d3.select(this).style("opacity", 1)
          d3.select("#tooltip")
            .attr("class", "toolTip")
            .transition().duration(300)
            .style("opacity", 0.8)
            .style("left", (d3.event.pageX - 345) + "px")
            .style("top", (d3.event.pageY - 120) + "px");

          if (d.properties.value) {
            d3.select("#tooltip").html(
                "<h4 class='state-head'>" + d.properties.name + " (" + d.properties.abbr + ")</h4>" +
                "<table><tr><th>Rank:</th><td>" + (d.properties.value) + " out of "+ max + "</td></tr>" +
                "<th>Number of upcoming " + GENRES[genre].label + " shows</th><td>" + d.properties.num + "</td></table>" +
                "<small>(click to zoom)</small>")
          } else {
            d3.select("#tooltip").html(
                "<h4>" + d.properties.name + " (" + d.properties.abbr + ")" + "</h4>" +
                "<table><tr><td> No upcoming shows </td></tr></table>");
          }
        }

        function mouseOut() {
          d3.selectAll(".map-path").style('opacity', 0.7)
          d3.select("#tooltip").transition().duration(500).style("opacity", 0);
        }

        var map = d3.select("#statesvg")
          //Binding the data to the SVG and create one path per json feature
          .selectAll("path")
          .data(states)
          .enter()
          .append("path")
          .attr("class", "map-path")
          .attr("d", map_path)
          .style("stroke", function(d) {
            if (d.properties.value) {
              return "#fff"
            } else {
              return "#ddd"
            }
          })
          .style("stroke-width", "1")
          .style("opacity", 0.7);


        // applying colour scheme based on html input for 'genre_'
        if (genre == "top") {
          map.on("mouseover", mouseOver_topgenre).on("mouseout", mouseOut)
            .style("fill", function(d) {
              if (d.properties.value) {
                return GENRES[d.properties.value]["color"];
              } else {
                return "#555a66";
              }

            });
        } else {
          if (genre != "top") {
            map.on("mouseover", mouseOver_genre).on("mouseout", mouseOut)
              .style("fill", function(d) {
                if (d.properties.value) {
                  return color_genre(d.properties.value)
                } else {
                  return "#555a66";
                }
              });
          }
        }

        //drawing counties onclick
        d3.selectAll('.map-path')
          .on('click', function(d) {
            $("#countymap").toggle()
            d3.selectAll("svg#statesvg > *").remove();
            d3.selectAll("svg#stats > *").remove();
            mouseOut();
            var state_abbr = d.properties.abbr;
            var state_bbox = get_state_bbox(state_abbr);
            usCounties.draw(state_bbox, current_genre); //function that draws leaflet
            current_state = state_abbr;
            if (current_genre != "top") {
              stats.draw(current_genre)
            } else {
              stats.top("top")
            }
            current_state = state_abbr;
            updateInfoBox(current_state);
            updateSums(current_genre)
          });
      });
  });
};

this.uStates = uStates;
