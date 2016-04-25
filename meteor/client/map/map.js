/*

var names =

_.each(names, function(doc) {
  Markers.insert(doc);
})
*/
if (Meteor.isClient) {
  Template.map.onCreated(function() {
    GoogleMaps.ready('map', function(map) {
      google.maps.event.addListener(map.instance, 'click', function(event) {
        console.log ("need to insert a point");
        console.log (event.latLng.lat() +","+ event.latLng.lng());
        Markers.insert({ latitude: event.latLng.lat(), longitude: event.latLng.lng() });
      });

      var markers = {};


      Packets.find ({Type: 'Location'}).observe ({
        added:function (NewDoc){
          console.log ("new location22");
          console.log (NewDoc);
        //  $("#packetLog").append (NewDoc.Latitude.DD + "  " + NewDoc.Longitude.DD + "<br />\n");

          var marker = new google.maps.Marker({
            draggable: false,
            position: new google.maps.LatLng(NewDoc.Latitude.DD, NewDoc.Longitude.DD),
            map: map.instance,
            id: NewDoc._id
          });



          markers[NewDoc._id] = marker;



        }
      });



      Markers.find().observe({
        added: function (document) {
          console.log ("new marker");
          var marker = new google.maps.Marker({
            draggable: false,
            position: new google.maps.LatLng(document.latitude, document.longitude),
            map: map.instance,
            id: document._id
          });

          google.maps.event.addListener(marker, 'dragend', function(event) {
            Markers.update(marker.id, { $set: { latitude: event.latLng.lat(), longitude: event.latLng.lng() }});
          });

          markers[document._id] = marker;
        },
        changed: function (newDocument, oldDocument) {
          console.log ("changed");
          markers[newDocument._id].setPosition({ lat: newDocument.latitude, lng: newDocument.longitude });
        },
        removed: function (oldDocument) {
          markers[oldDocument._id].setMap(null);
          google.maps.event.clearInstanceListeners(markers[oldDocument._id]);
          delete markers[oldDocument._id];
        }
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
