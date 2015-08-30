var logger = require("../utils/mt-log")("main-log");
var SOCKETEVENTS = require("../shared/socketevents");
//var Activity = require("../activities/activity");
var GameHandler = require("../conqr/gamehandler");

var Session = function Session(clients) {
    var clientNames, gameConf;

    this.clients = clients instanceof Array ? clients : [clients];
    clientNames = this.loadClients(clients);

    // create Game instance
    gameConf = {
        players: clientNames,
        worldSize: {
            x: 10,
            y: 10
        }
    };
    this.gameHandler = new GameHandler(gameConf);

    // send init view to clients after setting up
    this.clients.forEach(function (client) {
        client.socket.emit(SOCKETEVENTS.ACTIVITY.INIT_VIEW, this.gameHandler.getInitView());
    }.bind(this));
};

/**
 * Adds some clients to the session
 *
 */
Session.prototype.loadClients = function () {

    //clients = (clients instanceof Array) ? clients : [clients];

    var clientNames = this.clients.map(function (client) {
        return client.name;
    });


    this.clients.forEach(function (client) {

        //this.clients.push(client);

        // tell the clients we started the session
        client.socket.emit(
            SOCKETEVENTS.SESSION_START,
            {
                message: "Starting Game-Session now",
                clients: clientNames
            }
        );

        client.socket.removeAllListeners();

        // on socket disconnect
        client.socket.on(SOCKETEVENTS.DISCONNECT, function () {
            client.disconnected = true;
            logger.log("#Session: Client", client.name, "disconnected, don't know what to do, trying to stop");
            this.pause();
        }.bind(this));

        // HANDLE NEW INPUT
        client.socket.on(SOCKETEVENTS.ACTIVITY.NEW_INPUT, function (input) {
            this.handleClientInput(client.name, input);
        }.bind(this));

    }.bind(this));

    //clients.forEach(_handleClientFunc.bind(this));

    return clientNames;

};

/**
 * Updates the game and then sends a update to all clients with the changes
 * @param clientName
 * @param clientInput needs to look like:
 *      {
 *          command: "build",
 *          args: "{\"x\": 0, \"y\": 0}"
 *      }
 */
Session.prototype.handleClientInput = function (clientName, clientInput) {

    logger.log("#Session: Sending updated input for", clientName, ":", clientInput.toString());

    var hasHandled = this.gameHandler.handleCommand(clientName, clientInput.command, clientInput.params);

    if (!hasHandled) {
        return;
    }

    logger.log("#Session: Updating clients with new view", Object.keys(this.clients));

    this.clients.forEach(function (client) {
        client.socket.emit(SOCKETEVENTS.ACTIVITY.UPDATE_VIEW, this.gameHandler.getViewUpdate());
    }.bind(this));

};


/**
 * Initiates and starts a session and the depending activity
 */
//Session.prototype.start = function start() {
//
//    var clientNames = this.clients.map(function (client) {
//        return client.name;
//    });
//    logger.log("#Session: started with those clients:", clientNames);
//
//    // now that the activity is set up, send the initial status to the clients
//    this.clients.forEach(function(client){
//        //FIXME TODO
//        var viewData = this.activity.getInitView();
//        client.socket.emit(SOCKETEVENTS.ACTIVITY.INIT_VIEW, viewData);
//    }.bind(this));
//
//
//    logger.log("#Session: starting update view routine");
//    this._intervalReference = setInterval(this._update.bind(this), this.updateInterval);
//
//};


/**
 * This gets executed periodically and updates the clients view with the activity data
 * @private
 */
//Session.prototype._update = function(){
//
//    //FIXME TODO
//    this.activity.processTick();
//
//    //FIXME TODO
//    var viewData = this.activity.getUpdateView();
//
//    if(!viewData) return;
//
//    //
//
//    this.clients.forEach(function(client){
//        client.socket.emit(SOCKETEVENTS.ACTIVITY.UPDATE_VIEW, viewData);
//    }.bind(this));
//
//};


/**
 * Interrupts the session if someone leaves
 * need a way to detect rejoining users and re-start session
 */
//Session.prototype.pause = function(){
//    if(!this._intervalReference) {
//        logger.log("#Session: can't stop session that isnt running");
//        return;
//    }
//    logger.log("#Session: Clearing session update interval!");
//    clearInterval(this._intervalReference);
//    delete this._intervalReference;
//};


module.exports = Session;