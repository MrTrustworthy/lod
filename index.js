/**
 * Created by MT on 05.07.2015.
 */
var logger = require("./utils/mt-log")("main-log");
var PORT = require("./shared/socketevents").PORT;
var express = require('express');
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var favicon = require("serve-favicon");

var app = express();

var routeSessions = require("./webserver/session-router").router;
var routeMain = require("./webserver/main-router").router;

var socket = require("./sockethandler/communicator").io;


// *************************************************************
// ********************PREPROCESSING****************************
// *************************************************************

// serve favicon
app.use(favicon(__dirname + '/favicon.ico'));


// to open some files up for public
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/shared"));

// setup jade
app.set("view engine", "jade");
app.set("views", "public");
app.set("view options", {pretty: true}); // doesn't do SHIT as far as i can see

// development environment
app.set("env", "development");

// parses request body to extract post argument s
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// need cookies for session
app.use(cookieParser("bananarama"));

// need session
app.use(session({
    secret: "bananarama",
    resave: false,
    //store: Memorystore at the moment. need to change for prod!
    saveUninitialized: true,
    unset: "destroy" // deleting session will now cause logout etc.
}));


// *************************************************************
// ********************ROUTING**********************************
// *************************************************************

// ROUTING
app.use("/", routeMain);
app.use("/", routeSessions);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  logger.log("Someone 404'd!", req.path);
  res.send("Couldn't find the page, really sorry about that");
});


// run server
var server = app.listen(PORT, function(){
    logger.log("******************************************************************");
    logger.log("server up and running on port", PORT);
});
// let sockets listen on server
socket.listen(server);
