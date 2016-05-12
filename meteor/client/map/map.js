/*

var names =

_.each(names, function(doc) {
  Markers.insert(doc);
})
*/
let positionWatch;
var markers = {};
var googleMap;


if (Meteor.isClient) {
  Template.map.onCreated(function() {

    GoogleMaps.ready('map', function(map) {
      //Session.set ("googleMap", map);
      googleMap = map;
      google.maps.event.addListener(map.instance, 'click', function(event) {
        console.log ("need to insert a point");
        console.log (event.latLng.lat() +","+ event.latLng.lng());
        Markers.insert({ latitude: event.latLng.lat(), longitude: event.latLng.lng() });
      });


      positionWatch = navigator.geolocation.watchPosition(updatePosition, handlePermissionError, {
        enableHighAccuracy: true,
        timeout: 60000, //it might take a minute for the 60 to start from a cold start
        maximumAge: Infinity // I'll take any location data
      });


      Packets.find ({Type: 'Location'}).observe ({
        added:function (NewDoc){
        //  console.log ("new location22");
        //  console.log (NewDoc);
        //  $("#packetLog").append (NewDoc.Latitude.DD + "  " + NewDoc.Longitude.DD + "<br />\n");
        var icon = new google.maps.MarkerImage("http://mapt-static1.he.fi:8053/s0/aprs-symbols-24-0.png", new google.maps.Size(24, 24), new google.maps.Point(336, 0));

          var marker = new google.maps.Marker({
            draggable: false,
            animation: google.maps.Animation.DROP,
            position: new google.maps.LatLng(NewDoc.Latitude.DD, NewDoc.Longitude.DD),
            map: map.instance,
            icon: icon,
            id: NewDoc._id
          });
          markers[NewDoc._id] = marker;
        }//maps ready
      });



      
    });
  });

  Meteor.startup(function() {
    GoogleMaps.load();
  });

  Template.map.helpers({
    mapOptions: function() {
      if (GoogleMaps.loaded()) {
        return {
          center: new google.maps.LatLng(41.1028, -73.4512),

          zoom: 10
        };
      }
    }
  });
}

function updatePosition (pos){
  console.log ("updatePosition");
   const last = Session.get('location');
   console.log (last);
   if (last !== undefined){
     const distance = getDistance (pos.coords, last.coords);
     console.log (distance);
   }

   let location = {};
   location.timestamp = pos.timestamp;
   location.coords = {};
   location.coords.latitude = pos.coords.latitude;
   location.coords.longitude = pos.coords.longitude;
   location.coords.accuracy = pos.coords.accuracy;
   //console.log (JSON.stringify(location));
   Session.set('location', JSON.stringify(location));





  console.log (pos);
  //console.log (googleMap);
  markers["myLocation"] = new google.maps.Marker({
    draggable: false,
    position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
    map: googleMap.instance,
    id: "myLocation"
  });
  console.log ("updatePosition2");


  console.log (JSON.parse(Session.get('location')));
}
function handlePermissionError(err) {
    // console.warn('ERROR(' + err.code + '): ' + err.message);
    alert('ERROR (' + err.code + '): ' + err.message + ' Location data is not avaliable.');

}
// function calcDistance (point1, point2){
//   const R = 6378137; //radius of earth in meters
//
//   dlon = abs(point1.longitude - point2.longitude);
//   dlat = abs(point1.latitude - point2.latitude);
//   a = (Math.sin(dlat/2))^2 + cos(lat1) * cos(lat2) * (sin(dlon/2))^2;
//   c = 2 * atan2( sqrt(a), sqrt(1-a) );
//   d = R * c;
// }

//http://stackoverflow.com/questions/1502590/calculate-distance-between-two-points-in-google-maps-v3
var rad = function(x) {
  return x * Math.PI / 180;
};

var getDistance = function(p1, p2) {
  console.log ("getDistance");
  console.log (p1);
  console.log (p2);
  var R = 6378137; // Earth’s mean radius in meter
  var dLat = rad(p2.latitude - p1.latitude);
  var dLong = rad(p2.longitude - p1.longitude);
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(p1.latitude)) * Math.cos(rad(p2.latitude)) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d; // returns the distance in meter
};
