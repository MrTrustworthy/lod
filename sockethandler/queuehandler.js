var logger = require("../utils/mt-log")("main-log");
var EventHandler = require("../shared/js/mt-event");
var CONST = require("../utils/constants");
var SOCKETEVENTS = require("../shared/socketevents");
var Matchmaker = require("./matchmaker");
var ClientDTO = require("../utils/Objects/clientDTO");

/**
 * Queuehandler is a form of matchmaker
 *
 * @method Constructor
 * @param  {[type]} popAmount   [amount of people needed in queue to find match]
 * @param  {[type]} popInterval [check interval for matches]
 * @return {[type]}             [description]
 */
var QueueHandler = function QueueHandler(popAmount, popInterval) {

    this.popAmount = popAmount || 2;
    this.popInterval = popInterval || 2000;

    this.clients = [];

    // object to cancel the setInterval function of checkForPop
    this.intervalObj = null;

    EventHandler.makeEvented(this);
};

/**
 * It's an extension of the Matchmaker class. See Matchmaker.js for details.
 * @type {Matchmaker}
 */
QueueHandler.prototype = Object.create(Matchmaker.prototype);

/**
 * This is the socket handler function that gets the socket upcon connection
 * @param socket
 * @private
 */
QueueHandler.prototype.handleSocketConnection = function (socket) {
    logger.log("#Queuehandler: Someone connected to the Socket");

    // TODO find out how to get the users name from his session
    // TODO don't just move this down you lazy ass!
    var client = new ClientDTO(null, socket);

    socket.on(SOCKETEVENTS.MATCHMAKING.JOIN_MATCHMAKING, function (data) {
        logger.log("#Queuehandler: Client wants to join queue:", data.login_name, socket.id);

        client.setName(data.login_name);

        this.clients.push(client);
        this.__printClients();

        // handle user disconnect from queue by removing him
        var leaveQueueFunc = function leaveQueueFunc() {
            logger.log("#Queuehandler: one of our clients (", client.name, ":", client.socket.id, ") disconnected");
            this._removeClient(client);
            this.__printClients();
        }.bind(this);

        socket.once(SOCKETEVENTS.DISCONNECT, leaveQueueFunc);
        socket.once(SOCKETEVENTS.MATCHMAKING.LEAVE_MATCHMAKING, leaveQueueFunc);

    }.bind(this));

};

/**
 * Removes a given client (based on the name) from the client list
 * @param client
 * @returns {boolean}
 * @private
 */
QueueHandler.prototype._removeClient = function (client) {
    var i = -1;
    this.clients.forEach(function (element, index) {
        if (element.equals(client)) i = index;
    });

    if (i === -1) {
        logger.warn("#Queuehandler: Can't remove client that isn't in queue)");
        return false;
    }

    this.clients.splice(i, 1);
    return true;
};

/**
 * Internal function to check the current queue for possible matches
 *
 * @emits match_found when a match has been found
 * @private
 */
QueueHandler.prototype.__checkForPop = function () {
    if (this.clients.length >= this.popAmount) {
        logger.log("#Queuehandler: Enough Clients for Match in Queue");
        var matchedClients = this.clients.splice(0, this.popAmount);


        // send MATCH_FOUND
        matchedClients.forEach(function(client){
            client.socket.emit(SOCKETEVENTS.MATCHMAKING.MATCH_FOUND, {info: "Match found!"});
        });

        this.emit(CONST.MATCHMAKING.MATCH_FOUND_EVT, matchedClients);
    }
};

/**
 * Development/Debug function
 * @private
 */
QueueHandler.prototype.__printClients = function () {
    logger.log("#Queuehandler: Current Clients in Queue:");
    if (this.clients.length === 0) logger.log("----NONE----");
    this.clients.forEach(function (client) {
        logger.log(client.toString());
    });
};

//----------------------------
// PUBLIC FUNCTIONS
//----------------------------

/**
 * Starts the checking-for-matches routine
 */
QueueHandler.prototype.startChecking = function () {
    this.intervalObj = setInterval(this.__checkForPop.bind(this), this.popInterval);
};

/**
 * Stops the checking-for-matches routiné
 */
QueueHandler.prototype.stopChecking = function () {
    if (!this.intervalObj) {
        logger.warn("#Queuehandler: CANT CLEAR INTERVAL; DIDN'T START INTERVAL");
        return;
    }
    clearInterval(this.intervalObj);
    delete this.intervalObj;
};



module.exports = QueueHandler;
