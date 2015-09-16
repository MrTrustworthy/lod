var io = require("socket.io")();
var SOCKETEVENTS = require("../shared/socketevents");

// handling for the queue
var QueueHandler = require("./queuehandler");
var SessionHandler = require("./sessionhandler");

// setup the queue-handler to manage the "/queue" namespace
// queuehandler will emit "match_found" when it finds a queue match
var qHandler = new QueueHandler();
var matchSocket = io.of(SOCKETEVENTS.SOCKET_PATH);
matchSocket.on(SOCKETEVENTS.CONNECTION, qHandler.handleSocketConnection.bind(qHandler));

var gsHandler = new SessionHandler();
gsHandler.watch(qHandler);


// export io to index.js so it can be integrated into the server
module.exports.io = io;
