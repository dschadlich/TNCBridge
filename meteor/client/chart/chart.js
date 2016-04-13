Template.chart.helpers ({
  formatd: function (input){
    console.log ("format d called");
  }

});
Template.formatd = function (){
   console.log ("formatd");
  let d =  Markers.find ({});
  //need to make a subscription and then use the on ready

  let count = 1;
  let results = [];
  Markers.find ({}).forEach(function (marker) {
    console.log(count + ":" + marker.altitude);
    results.push ([count, marker.altitude]);
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
