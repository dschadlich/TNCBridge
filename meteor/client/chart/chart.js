// Template.chart.helpers ({
//   formatd: function (input){
//     console.log ("format d called");
//   }
//
// });
// Template.formatd = function (){
//    console.log ("formatd");
//   let d =  Markers.find ({}).fetch ();
//   console.log (d);
//   //need to make a subscription and then use the on ready
//
//   let count = 1;
//   let results = [];
//   Markers.find ({}).forEach(function (marker) {
//     console.log(count + ":" + marker.altitude);
//     results.push ([count, marker.altitude]);
//     count += 1;
//   });
//
//   //console.log (d);
//
//   //console.log (results);
//   //return results;
// };
// Template.chart.onRendered(function() {
//     console.log ("chart rendered");
//     Meteor.setTimeout(findMarkers, 10);
//   Template.chart.onCreated (function(){
//     this.subscribe('markers');
//   });
//
//
//
//
// });
// function findMarkers (){
//   // console.log ("findMarkers run");
//   // let d =  Markers.find ({}).fetch ();
//   // console.log (d);
//
//
//
//   let count = 1;
//   let results = [];
//   Markers.find ({}).forEach(function (marker) {
//     console.log(count + ":" + marker.altitude);
//     results.push ([count, marker.altitude]);
//     count += 1;
//   });
//
// }






Template.chart.onRendered(function () {
  // Meteor.subscribe('packets');
  // Packets.find ({Type: 'Location'}).observe ({
  //   added:function (NewDoc){
  //   //  console.log ("new location");
  //   //  console.log (NewDoc);
  //     $("#packetLog").append (NewDoc.Latitude.DD + "  " + NewDoc.Longitude.DD + "<br />\n");
  //   }
  // });
  //
  // Packets.find ({Type: 'SYS_STAT'}).observe ({
  //   added:function (NewDoc){
  //     console.log ("new SYS_STAT");
  //     console.log (NewDoc);
  //     $("#packetLog").append (NewDoc.Temperature0.value + NewDoc.Temperature0.unit + " " + NewDoc.Temperature1.value + NewDoc.Temperature1.unit + " " + NewDoc.Temperature2.value + NewDoc.Temperature2.unit  +"<br />\n");
  //   }
  // });





//d3 code

var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.close); });

var svg = d3.select("#barChart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
console.log (svg);
d3.tsv("data.tsv", type, function(error, data) {
  console.log ("got tsv data");

  if (error) throw error;
  //console.log (data);
  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain(d3.extent(data, function(d) { return d.close; }));

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Price ($)");

  svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);
});
























  //console.log (Meteor.packets;
});
//Type: 'SYS_STAT'
function type(d) {

  d.date = d3.time.format("%d-%b-%y").parse(d.date);
  d.close = +d.close;
  return d;
}
