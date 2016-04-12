Template.chart.helpers ({
  formatd: function (input){
    console.log ("format d called");
  }

});

Template.chart.rendered = function () {
  console.log ("chart rendered");
  console.log ();
  //formatd ();
  let d = Markers.find ({}).fetch ();
  $("#graph").plot(d,  {
    xaxis: { mode: "time" }
  });

}
