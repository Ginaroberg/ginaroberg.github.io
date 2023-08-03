function assignment7() {
    var filePath = "cab_rides.csv";
    question0(filePath);
  }
  
  var question0 = function (filePath) {
    var filePath = "cab_rides.csv";
    d3.csv(filePath).then(function(data){
        console.log(data)
        question1(data);
        question2(data);
        });
  }
  

  
  
  
  var question1 = function (filePath) {
    var filePath = "cab_rides.csv";
    const svgwidth = 1200;
    const svgheight = 900;
    const padding = 100;
  
    d3.csv(filePath).then(function (data) {
      // Preprocess data here
      data.forEach(function (d) {
        d.distance = +d.distance; // Convert distance column to number
        d.price = +d.price; // Convert price column to number
      });
  
      const distances = d3.group(data, (d) => d.cab_type); // Group data by cab_type
  
      let scatter = d3.select("#q1_plot").append("svg")
        .attr("width", svgwidth)
        .attr("height", svgheight);
  
      const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, (d) => d.distance)])
        .range([padding, svgwidth - padding]);
  
      const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, (d) => d.price)])
        .range([svgheight - padding, padding]);
  
      const colorScale = d3.scaleOrdinal()
        .domain(["Lyft", "Uber"])
        .range(["magenta", "black"]);
  
     // Create x-axis
    scatter.append("g")
    .attr("transform", "translate(0," + (svgheight - padding) + ")")
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .attr("text-anchor", "end")
    .style("font-size", "20px"); // Increase font size

    // Create y-axis
    scatter.append("g")
    .attr("transform", "translate(" + padding + ",0)")
    .call(d3.axisLeft(yScale))
    .selectAll("text")
    .style("font-size", "20px"); // Increase font size
  
      scatter.append("text")
        .attr("x", svgwidth / 2)
        .attr("y", svgheight - padding / 2)
        .style("text-anchor", "middle")
        .style("font-size", "40px")
        .text("Distance");
  

  
      scatter.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -svgheight / 2)
        .attr("y", padding / 2)
        .style("text-anchor", "middle")
        .style("font-size", "40px")
        .text("Price");
  
      scatter.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(d.distance))
        .attr("cy", (d) => yScale(d.price))
        .attr("r", 4)
        .attr("fill", (d) => colorScale(d.cab_type));
  
  // Create legend
const legend = scatter.append("g")
.attr("class", "legend")
.attr("transform", "translate(" + (svgwidth - 120) + "," + padding + ")");

const legendEntries = legend.selectAll("g")
.data(["Lyft", "Uber"])
.enter()
.append("g")
.attr("transform", (d, i) => "translate(0," + (i * 20) + ")");

legendEntries.append("rect")
.attr("x", 0)
.attr("y", -20)
.attr("width", 20)
.attr("height", 20)
.attr("fill", (d) => colorScale(d));

legendEntries.append("text")
.attr("x", 20)
.attr("y", 9)
.style("font-size", "45px")
.style("text-anchor", "start")
.text((d) => d);

// Adjust positioning of legend entries
legendEntries.attr("transform", function (d, i) {
const entryHeight = this.getBBox().height;
const entrySpacing = 5;
const yPos = i * (entryHeight + entrySpacing);
return "translate(0," + yPos + ")";
});


scatter.append("text")
  .attr("x", svgwidth / 2)
  .attr("y", padding / 2)
  .attr("text-anchor", "middle")
  .style("font-size", "50px")
  .text("Scatter Plot of Cab Rides");


    })}


  
  
    var question2 = function() {
        const svg = d3
          .select("#q2_plot")
          .append("svg")
          .attr("width", 800)
          .attr("height", 600);
      
        const mapContainer = svg.append("g");
      

      
        d3.json("boston.geojson").then(function(data) {
          const projection = d3.geoMercator().fitSize([800, 600], data);
          const path = d3.geoPath().projection(projection);
      
          mapContainer
            .selectAll("path")
            .data(data.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("stroke", "black")
            .attr("fill", "lightgray")
            .attr("vector-effect", "non-scaling-stroke");
      
          d3.csv("new.csv").then(function(data) {
            data.forEach(function(d) {
              d.pickup_latitude = +d.pickup_latitude;
              d.pickup_longitude = +d.pickup_longitude;
              d.dropoff_latitude = +d.dropoff_latitude;
              d.dropoff_longitude = +d.dropoff_longitude;
            });
      
            var filteredData = data.filter(function(d) {
              return (
                d.pickup_longitude >= -71.1912 &&
                d.pickup_longitude <= -70.9227 &&
                d.pickup_latitude >= 42.2279 &&
                d.pickup_latitude <= 42.3991 &&
                d.dropoff_longitude >= -71.1912 &&
                d.dropoff_longitude <= -70.9227 &&
                d.dropoff_latitude >= 42.2279 &&
                d.dropoff_latitude <= 42.3991
              );
            });
      
            mapContainer
              .selectAll(".pickup")
              .data(filteredData)
              .enter()
              .append("circle")
              .attr("class", "pickup")
              .attr("cx", function(d) {
                return projection([d.pickup_longitude, d.pickup_latitude])[0];
              })
              .attr("cy", function(d) {
                return projection([d.pickup_longitude, d.pickup_latitude])[1];
              })
              .attr("r", 3)
              .attr("fill", "blue")
              .on("mouseover", function(d) {
                // Show tooltip on mouseover
                tooltip.transition().duration(200).style("opacity", 0.9);
                tooltip.html("Pickup: " + d.pickup_count + " times")
                  .style("left", (d3.event.pageX + 10) + "px")
                  .style("top", (d3.event.pageY - 20) + "px");
              })
              .on("mouseout", function(d) {
                // Hide tooltip on mouseout
                tooltip.transition().duration(500).style("opacity", 0);
              });
      
            mapContainer
              .selectAll(".dropoff")
              .data(filteredData)
              .enter()
              .append("circle")
              .attr("class", "dropoff")
              .attr("cx", function(d) {
                return projection([d.dropoff_longitude, d.dropoff_latitude])[0];
              })
              .attr("cy", function(d) {
                return projection([d.dropoff_longitude, d.dropoff_latitude])[1];
              })
              .attr("r", 3)
              .attr("fill", "red")
              .on("mouseover", function(d) {
                // Show tooltip on mouseover
                tooltip.transition().duration(200).style("opacity", 0.9);
                tooltip.html("Dropoff: " + d.dropoff_count + " times")
                  .style("left", (d3.event.pageX + 10) + "px")
                  .style("top", (d3.event.pageY - 20) + "px");
              })
              .on("mouseout", function(d) {
                // Hide tooltip on mouseout
                tooltip.transition().duration(500).style("opacity", 0);
              });
      
            mapContainer
              .selectAll(".pickup-label")
              .data(filteredData)
              .enter()
              .append("text")
              .attr("class", "pickup-label")
              .attr("x", function(d) {
                return projection([d.pickup_longitude, d.pickup_latitude])[0] + 5;
              })
              .attr("y", function(d) {
                return projection([d.pickup_longitude, d.pickup_latitude])[1] - 5;
              })
              .text(function(d) {
                return d.source;
              })
              .attr("font-size", "10px")
              .attr("fill", "blue")
              .attr("pointer-events", "none");
      
            mapContainer
              .selectAll(".dropoff-label")
              .data(filteredData)
              .enter()
              .append("text")
              .attr("class", "dropoff-label")
              .attr("x", function(d) {
                return projection([d.dropoff_longitude, d.dropoff_latitude])[0] + 5;
              })
              .attr("y", function(d) {
                return projection([d.dropoff_longitude, d.dropoff_latitude])[1] - 5;
              })
              .text(function(d) {
                return d.destination;
              })
              .attr("font-size", "10px")
              .attr("fill", "red")
              .attr("pointer-events", "none");
      
            mapContainer
              .selectAll(".link")
              .data(filteredData)
              .enter()
              .append("line")
              .attr("class", "link")
              .attr("x1", function(d) {
                return projection([d.pickup_longitude, d.pickup_latitude])[0];
              })
              .attr("y1", function(d) {
                return projection([d.pickup_longitude, d.pickup_latitude])[1];
              })
              .attr("x2", function(d) {
                return projection([d.dropoff_longitude, d.dropoff_latitude])[0];
              })
              .attr("y2", function(d) {
                return projection([d.dropoff_longitude, d.dropoff_latitude])[1];
              })
              .attr("stroke", "gray")
              .attr("stroke-width", 1);
          });
        });
      };
      
   
      
      

      



  

  