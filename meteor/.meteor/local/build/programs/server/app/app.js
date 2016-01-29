var require = meteorInstall({"lib":{"router.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// lib/router.js                                                                                               //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
Router.route('/api/v1', function () {                                                                          // 1
  // This is where we handle the request.                                                                      //
  this.response.setHeader('Access-Control-Allow-Origin', '*');                                                 // 3
                                                                                                               //
  if (this.request.method === "OPTIONS") {                                                                     // 5
    this.response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    this.response.setHeader('Access-Control-Allow-Methods', 'PUT');                                            // 7
    this.response.end('Set OPTIONS.');                                                                         // 8
  } else {                                                                                                     //
    API.handleRequest(this, 'pizza', this.request.method);                                                     // 10
  }                                                                                                            //
}, { where: 'server' });                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"server":{"api":{"add":{"add.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// server/api/add/add.js                                                                                       //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
                                                                                                               //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"main.js":["meteor/meteor",function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// server/main.js                                                                                              //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
var _meteor = require('meteor/meteor');                                                                        // 1
                                                                                                               //
_meteor.Meteor.startup(function () {                                                                           // 3
  // code to run on server at startup                                                                          //
});                                                                                                            //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}]}},{"extensions":[".js",".json"]});
require("./lib/router.js");
require("./server/api/add/add.js");
require("./server/main.js");
//# sourceMappingURL=app.js.map
