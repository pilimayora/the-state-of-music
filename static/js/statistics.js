//setting dimentions
const bar_margin = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 120
  },
  bar_width = 300 - bar_margin.left - bar_margin.right,
  bar_height = 300 - bar_margin.top - bar_margin.bottom;

const x = d3.scaleLinear().range([0, bar_width]);
const y = d3.scaleBand().range([bar_height, 0]);

const stats = {};

stats.draw = function(genre) {

  var params = jQuery.param({
    genre: genre,
    filter_state: current_state,
    filter_county: current_county,
  });

  var request_url = "stats/" + geo_level + "?" + params;

  d3.json(request_url, function(error, data) {
    if (error) console.log(error);

    data = data['data']

    //sort bars based on value
    data = data.sort(function(a, b) {
      return a.ranking - b.ranking
    })
    console.log(data)

    //finding top five states
    data = data.slice(0, 5).reverse();

    //creating svg object
    const chart = d3.select("#displayStats").select("svg")

    //assigning margins
    const bar = chart.append("g")
      .attr("transform", "translate(" + bar_margin.left + "," + bar_margin.top + ")")

    if (genre != "top") {

      // setting domains for bars
      x.domain([0, d3.max(data, function(d) {
        return d.value
      })]);

      //drawing bars in chart
      bar.selectAll('.bar').data(data)
        .enter().append('rect')
        .attr("class", "bar")
        .attr("width", function(d) {
          return x(d.value);
        }) //assigning width of bars
        .attr("fill", function(d) {
          return GENRES[genre].color
        })

        //adding labels to axis
        bar.selectAll(".text")
          .data(data).enter()
          .append("text")
          .attr("class", "axis-text")
          .attr("dy", ".35em")
          .attr("x", function(d) {
            return -100
          })
          .attr("text-anchor", "right")
          .style("fill", "#555a66;");

        //adding values to bars
        bar.selectAll(".text")
          .data(data).enter()
          .append("text")
          .attr("class", "bar-text")
          .attr("dy", ".35em")
          .attr("x", function(d) {
            return x(d.value) - 10
          })
          .attr("text-anchor", "middle")
          .text(function(d) {
            return d.ranking
          })
          .style("fill", "white")


      if(geo_level == "state"){
        y.domain(data.map(function(d) {
          return d.state_name
        })).padding(0.3);

        bar.selectAll('.bar')
          .attr('y', function(d) {
            return y(d.state_name);
          })
          .attr("height", y.bandwidth()); //assigning hieght of bars

          bar.selectAll(".bar-text")
          .attr("y", function(d) {
            return y(d.state_name) + y.bandwidth() / 2
          })

          bar.selectAll(".axis-text")
          .attr("y", function(d) {
            return y(d.state_name) + y.bandwidth() / 2
          })
          .text(function(d) {
            return d.state_name
          })
          .call(wrap, bar_margin.left);

      } else if (geo_level == "county") {

        y.domain(data.map(function(d) {
          return d.county_name
          })).padding(0.3);

        bar.selectAll('.bar')
          .attr('y', function(d) {
            return y(d.county_name)
          })
          .attr("height", y.bandwidth()); //assigning hieght of bars

        bar.selectAll(".bar-text")
        .attr("y", function(d) {
          return y(d.county_name) + y.bandwidth() / 2
        })

        bar.selectAll(".axis-text")
        .attr("y", function(d) {
          return y(d.county_name) + y.bandwidth() / 2
        })
        .text(function(d) {
          return d.county_name
        })
        .call(wrap, bar_margin.left);

      } else if (geo_level == "venue") {
        y.domain(data.map(function(d) {
          return d.venue
          })).padding(0.3);

          bar.selectAll('.bar')
            .attr('y', function(d) {
              return y(d.venue)
            })
            .attr("height", y.bandwidth()); //assigning hieght of bars

            bar.selectAll(".bar-text")
            .attr("y", function(d) {
              return y(d.venue) + y.bandwidth() / 2
            })

            bar.selectAll(".axis-text")
            .attr("y", function(d) {
              return y(d.venue) + y.bandwidth() / 2
            })
            .text(function(d) {
              return d.venue
            })
            .call(wrap, bar_margin.left);
      }

      //assigning y-axis
      bar.append('g').attr("class", "y axis").call(d3.axisLeft(y).tickFormat(function(d) {
        return d.county_name;
      }));

    }

  });
};

this.stats = stats;
