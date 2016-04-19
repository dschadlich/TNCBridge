Markers = new Mongo.Collection('markers');
if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('markers', function chartData() {
    return Markers.find({});
  });

  // Meteor.publish('markers', function mapData() {
  //   return Markers.find({});
  // });


}
