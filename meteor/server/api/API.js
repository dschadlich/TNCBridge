API = {
  authentication: function( apiKey ) {
    //for authentication of apiKeys, right now everyone can access the API
    return true;
  },
  connection: function( request ) {
    let getRequestContents = API.utility.getRequestContents (request)
    return { data: getRequestContents };


  },
  handleRequest: function( context, resource, method ) {
    console.log ("handle request");
    //console.log (context.request.body);
    //console.log (context.connection);
    let connection = API.connection (context.request);
    API.methods[ resource ][ method ]( context, connection );

  },
  methods: {
    balloon: {
      GET: function( context, connection ) {},
      POST: function( context, connection ) {},
      PUT: function( context, connection ) {
        console.log ("put balloon");
        // console.log (context);
         console.log (connection.data);
      },
      DELETE: function( context, connection ) {}
    }
  },
  resources: {},
  utility: {
    getRequestContents: function( request ) {
      switch( request.method ) {
        case "GET":
        return request.query;
        case "POST":
        case "PUT":
        case "DELETE":
        return request.body;
      }

    },
    hasData: function( data ) {},
    response: function( context, statusCode, data ) {},
    validate: function( data, pattern ) {}
  }
};
