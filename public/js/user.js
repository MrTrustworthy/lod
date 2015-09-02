/**
 * Created by MrTrustworthy on 01.08.2015.
 */

var Deferred = require("./mt-promise");
var Game = require("./game");
var io = require("./libs/socket.io");
var SOCKETEVENTS = require("../socketevents");

/**
 * A user is the entity that connects to the queue and joins a activity
 * @constructor
 */
var User = function () {
    this.name = null;
    //this.socket = null;
    this.socketConnected = null;
    this.inQueue = false;

    //gets initialized when activity session starts
    this.game = null;

    this.btnStartQueue = document.getElementById("queuestart");
    this.btnEndQueue = document.getElementById("queueend");
};

/**
 * Sets the users name
 * (need this to init the matchmaking until we find a serverside way to extract it from the session)
 * @param user_name
 */
User.prototype.setName = function (user_name) {
    this.name = user_name;
    this.game = null;
};

/**
 * Loads a connection to the given socket and adds a basic message logger
 * @param path
 */
User.prototype.loadSocket = function (path) {
    var socket, deferred;
    socket = io(path);
    deferred = new Deferred();

    this.socketConnected = deferred.promise;

    socket.on(SOCKETEVENTS.CONNECT, function () {

        console.log("Successfully connected to Socket");

        // general message listener
        socket.on(SOCKETEVENTS.MESSAGE, function (data) {
            console.info("Recieved message from server:", data);
        });

        deferred.resolve(socket);

    }.bind(this));
};

/**
 * Initializes the listeners on the queue-buttons
 */
User.prototype.setupListeners = function () {
    this.btnStartQueue.onclick = this.joinQueueFunc.bind(this);
    this.btnEndQueue.onclick = this.leaveQueueFunc.bind(this);
    this.btnEndQueue.disabled = true;
};

/**
 * Gets called on "session_start" and manages the activity
 * @param data
 */
User.prototype.startSessionFunc = function (data) {
    console.log("Starting Activity-Session:", data);

    this.btnEndQueue.disabled = true;
    this.btnStartQueue.disabled = true;


    this.socketConnected.then(function(socket){
        this.game = new Game(socket);
        this.game.start();
    }.bind(this));

};


/**
 * This emits a "join_matchmaking" to the server and responds with the found match
 * @private
 */
User.prototype.joinQueueFunc = function () {
    if (!!this.inQueue) {
        console.log("Already in queue, can't join again it!");
        return;
    }
    this.inQueue = true;
    this.btnStartQueue.disabled = true;
    this.btnEndQueue.disabled = false;

    this.socketConnected.then(function (socket) {

        console.log("Joining matchmaking now");
        socket.emit(SOCKETEVENTS.MATCHMAKING.JOIN_MATCHMAKING, {login_name: this.name});

        socket.once(SOCKETEVENTS.MATCHMAKING.MATCH_FOUND, function (data) {
            console.info("found a match!", data);

            socket.once(SOCKETEVENTS.SESSION_START, this.startSessionFunc.bind(this));

        }.bind(this));

    }.bind(this));

};

/**
 * This removes the user from the server by sending "leave_matchmaking"
 * @private
 */
User.prototype.leaveQueueFunc = function () {
    if (!this.inQueue) {
        console.log("Not in queue, can't leave it!");
        return;
    }

    this.socketConnected.then(function (socket) {
        socket.emit(SOCKETEVENTS.MATCHMAKING.LEAVE_MATCHMAKING);
        console.log("SEND LEAVE MATCHMAKING");
        this.inQueue = false;
        this.btnStartQueue.disabled = false;
        this.btnEndQueue.isDisabled = true;
    }.bind(this));

};

//-------------DEBUG HELPERS-------------------
User.prototype.printSocket = function () {
    this.socketConnected.then(function (socket) {
        console.log("socket:", socket);
    });
};

module.exports = User;