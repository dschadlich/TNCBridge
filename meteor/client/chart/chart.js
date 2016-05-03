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






Template.body.onRendered(function bodyOnCreated() {
  Meteor.subscribe('packets');
  Packets.find ({Type: 'Location'}).observe ({
    added:function (NewDoc){
    //  console.log ("new location");
    //  console.log (NewDoc);
      $("#packetLog").append (NewDoc.Latitude.DD + "  " + NewDoc.Longitude.DD + "<br />\n");
    }
  });

  Packets.find ({Type: 'SYS_STAT'}).observe ({
    added:function (NewDoc){
      console.log ("new SYS_STAT");
      console.log (NewDoc);
      $("#packetLog").append (NewDoc.Temperature0.value + NewDoc.Temperature0.unit + " " + NewDoc.Temperature1.value + NewDoc.Temperature1.unit + " " + NewDoc.Temperature2.value + NewDoc.Temperature2.unit  +"<br />\n");
    }
  });

  //console.log (Meteor.packets;
});
Type: 'SYS_STAT'
