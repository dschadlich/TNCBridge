API = {
  authentication: function( apiKey ) {},
  connection: function( request ) {},
  handleRequest: function( context, resource, method ) {
    console.log ("handle request");
  },
  methods: {
    pizza: {
      GET: function( context, connection ) {},
      POST: function( context, connection ) {},
      PUT: function( context, connection ) {},
      DELETE: function( context, connection ) {}
    }
  },
  resources: {},
  utility: {
    getRequestContents: function( request ) {},
    hasData: function( data ) {},
    response: function( context, statusCode, data ) {},
    validate: function( data, pattern ) {}
  }
};
