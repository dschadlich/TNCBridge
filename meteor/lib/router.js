Router.route( '/api/v1', function() {
  // This is where we handle the request.
  this.response.setHeader( 'Access-Control-Allow-Origin', '*' );

  if ( this.request.method === "OPTIONS" ) {
    this.response.setHeader( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept' );
    this.response.setHeader( 'Access-Control-Allow-Methods', 'PUT' );
    this.response.end( 'Set OPTIONS.' );
  } else {
    API.handleRequest( this, 'pizza', this.request.method );
  }
}, { where: 'server' } );
