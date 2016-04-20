Router.route( '/', function() {
  this.render ('main');
});
Router.route( '/map', function() {
  this.render ('map');
});
Router.route( '/api/v1/balloon', function() {
  // This is where we handle the request.
  this.response.setHeader( 'Access-Control-Allow-Origin', '*' );

  if ( this.request.method === "OPTIONS" ) {
    this.response.setHeader( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept' );
    this.response.setHeader( 'Access-Control-Allow-Methods', 'PUT' );
    this.response.end( 'Set OPTIONS.' );
  } else { 
    API.handleRequest( this, 'balloon', this.request.method );
  }
}, { where: 'server' } );
