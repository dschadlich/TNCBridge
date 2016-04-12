Template.chart.helpers ({
  formatd: function (input){
    console.log ("format d called");
  }

});
Template.formatd = function (){
   console.log ("formatd");
  let d =  Markers.find ({});

  let count = 1;
  let results = [];
  d.forEach(function (marker) {
    console.log ("foreach run");
  console.log(count + ":" + marker.altitude);
  results.push ([count, marker.altitude]);
//need to make a subscription and then use the on ready
  count += 1;
  });

  //console.log (d);

  //console.log (results);
  //return results;
};

Template.chart.rendered = function () {
  console.log ("chart rendered");
Template.formatd ();

//  $.plot("#graph", [ Template.formatd () ]);


  //.setData(d2).setupGrid().draw ();

}
