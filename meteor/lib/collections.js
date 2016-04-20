Markers = new Mongo.Collection('markers');


 Packets = new Mongo.Collection( 'packets' );



if (Meteor.isServer) {





  Meteor.publish('packets', function getPackets() {
    return Packets.find({});
  });



  // This code only runs on the server
  Meteor.publish('markers', function chartData() {
    return Markers.find({});
  });

  // Meteor.publish('markers', function mapData() {
  //   return Markers.find({});
  // });


}
