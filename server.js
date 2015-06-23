var express = require('express')
, app = express();

var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var session         = require('express-session');
var cookieParser         = require('cookie-parser');
var errorHandler         = require('errorhandler');
var methodOverride = require('method-override');
var imageable  = require("imageable");
var fs         = require("fs");
var imageableConfigFile = __dirname + "/" + (process.env.CONFIG || "config/config.json");
var imageableConfig     = JSON.parse(fs.readFileSync(imageableConfigFile));
RedisStore = require('connect-redis')(session);

var rtg   = require("url").parse("redis://redistogo:1e590afd55211150c2d991f5cd907425@mummichog.redistogo.com:9061/");
var redis = require("redis").createClient(rtg.port, rtg.hostname);
appGlobal = {};
appGlobal.redisClient = redis;

redis.auth(rtg.auth.split(":")[1]);

mongoose = require('mongoose');
mongoose.connect("mongodb://armel123:gnonmyss1@ds033699.mongolab.com:33699/heroku_app23047925");

var sockjs = require("sockjs");
var http = require("http");

var RSVP = require('rsvp');
var raygun = require('raygun');
var raygunClient = new raygun.Client().init({ apiKey: '30RZbkjL2MoJAtl7oKhAEQ==' });
RSVP.on('error', function(reason) {
  console.error( reason);
  if(raygunClient){
    try {
      throw new Error(reason);
    }
    catch(e) {
      raygunClient.send(e);
    }
  }
});

raygunClient.user = function (req) {
  if (req && req.session && req.session.username) {
    return req.session.username;
  }
}
var domain = require('domain');



var env = process.env.NODE_ENV || 8888 || 'development';
if ('development' == env) {
   // configure stuff here
}
  app.use(methodOverride());
  app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
  app.use(bodyParser.json({limit: '50mb'})) 
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });
  app.use(cookieParser());
  //app.use(session({secret:'trebbleSessionHash'}));
  app.use(session({secret: 'trebbleSessionHash', store: new RedisStore({"client": redis})}));
  app.use(express.static( __dirname + "/.."));
  app.use(imageable(imageableConfig, {
    before: function(stats) { console.log('before');console.log(stats) },
    after: function(stats, returnValueOfBefore, err) {
     console.log('after') ;
     console.log(stats);
     if(err){
       console.error( err);
        if(raygunClient){
          try {
            throw new Error(err);
          }
          catch(e) {
            raygunClient.send(e);
          }
        }
     }}
  }));
  app.use(errorHandler({ dumpExceptions: true, showStack: true }));




var server = http.createServer(app); 

// Mount the SockJS server on the HTTP server
sockjsServer.installHandlers(server, {
  prefix: "/messages"
});

// Listen to PORT provided by Heroku or default (80)
//server.listen(process.env.PORT || 8888, "127.0.0.1"); // onlocalhost
server.listen(process.env.PORT || 8888);
app.use(raygunClient.expressHandler);


//app.listen(process.env.PORT || 8888 );
console.log('trebble image express server running at http://localhost:%d', process.env.PORT ||  8888);