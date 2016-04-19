API = {
  authentication: function( apiKey ) {},
  connection: function( request ) {},
  handleRequest: function( context, resource, method ) {
    console.log ("handle request");
    console.log (resource);
  },
  methods: {
    pizza: {
      GET: function( context, connection ) {},
      POST: function( context, connection ) {},
      PUT: function( context, connection ) {console.log ("put pizza");},
      DELETE: function( context, connection ) {}
    }
  },
  resources: {}f,
  utility: {
    getRequestContents: function( request ) {},
    hasData: function( data ) {},
    response: function( context, statusCode, data ) {},
    validate: function( data, pattern ) {}
  }
};
