$("#top").addClass("selected")
uStates.draw("top")
stats.draw("top")

//function updateInfoBox(label) {
//  $("#titleGenre").html(label);
  //this slightly  ugly solution shifts the colouring of the info boxes
  //it's repeated in the updatelogo function below
//  document.documentElement.style.setProperty('--displayInfo-color', "#efefef");
//  $("#titleCategory").html("Where live " + label + " music is most popular")
//  document.documentElement.style.setProperty('--displayInfo-text-color', "#555b66");
//  $("#displayStatsTitle").html("Where should " + label + " fans go this month?");
//}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function updateInfoBox(geog) {
var gen_text
var geo_text
if (current_genre == 'top') {
  gen_text = 'All genres'
}
else {
  gen_text = GENRES[current_genre].label
  gen_text = capitalizeFirstLetter(gen_text)
}

if (geo_level == 'state') {
  geo_text = 'at state level'
}
else if (geo_level == 'county') {
  for (i = 0; i < 51; i++) {
  if (states_geo.features[i].properties.abbr == geog) {
    geo_text = states_geo.features[i].properties.name_2;
  }}
  geo_text = 'in '+geo_text
}
else if (geo_level == 'venue') {
  geo_text = 'in '+geog;
}
console.log(gen_text + " " + geo_text);
$("#titleGenre").html(gen_text + " " + geo_text);
}

//Update data section (Called from the onclick)
function updateData() {
  d3.selectAll(".genre-icon")
    .on('click', function() {
      var genre_id = d3.select(this).attr('id')
      current_genre = genre_id;

      // Make all icons (except this) transparent
      if($('.genre-icon').not(this).hasClass("selected")) {
        $(".genre-icon").removeClass("selected")
      }
      // Make this opaque
      if (!$(this).hasClass("selected")){
        $(this).addClass("selected")
      }

      // removing state map and statistics
      d3.selectAll("svg#statesvg > *").remove();
      d3.selectAll("svg#stats > *").remove();

      // adding new maps depending on geo_level
      if (geo_level == "state") {
        uStates.draw(genre_id);
        stats.draw(genre_id);
        updateInfoBox();
      } else if (geo_level == "county") {
        usCounties.recalculateGenres(genre_id);
        stats.draw(genre_id);
        updateInfoBox(current_state);
      } else if (geo_level == "venue") {
        usVenues.draw(genre_id)
        stats.draw(genre_id);
        updateInfoBox(current_county);
      }
      // if (genre_id != "top") {
      //   updateInfoBox(GENRES[genre_id].label);
      // } else {
      //   updateInfoBox("music");
      //}
    });
}



function updatelogo() {
  d3.selectAll('#logo')
    .on('click', function() {
      $(".genre-icon").removeClass("selected")
      $("#top").addClass("selected")
      // removing state map and statistics
      d3.selectAll("svg#statesvg > *").remove();
      d3.selectAll("svg#stats > *").remove();

      current_genre = "top"

      // adding new maps depending on geo_level
      if (geo_level == "state") {
        uStates.draw("top");
      } else {
        $("#countymap").toggle();
        geo_level = "state"
        uStates.draw("top");
      }

      // adding top genre stats
      stats.draw("top");

      // $("#titleGenre").html("music");
      document.documentElement.style.setProperty('--displayInfo-color', "#888b94");
      // $("#titleCategory").html("The most popular types of live music")
      document.documentElement.style.setProperty('--displayInfo-text-color', "#FFFFFF");
      //$("#displayStatsTitle").html("Which states feel the strongest about each genre?");
    });
}
