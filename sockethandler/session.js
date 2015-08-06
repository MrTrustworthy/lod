/**
 * Created by MrTrustworthy on 01.08.2015.
 */
var SOCKETEVENTS = require("../shared/socketevents");
var Activity = require("../activities/activity");


var Session = function Session(updateInterval) {
    this.clients = [];
    this.updateInterval = updateInterval || 50;

    this.activity = new Activity();

    this._intervalReference = null;
};

/**
 * Adds some clients to the session
 *
 * @param clients
 */
Session.prototype.addClients = function(clients){
    clients = (clients instanceof Array) ? clients : [clients];

    var clientNames = clients.map(function (client) {
        return client.name;
    });


    var _handleClientFunc =  function _handleClientFunc(client){

        this.clients.push(client);

        // tell the clients we started the session
        client.socket.emit(
            SOCKETEVENTS.SESSION_START, {
                message: "Starting Activity-Session now",
                clients: clientNames
            }
        );

        client.socket.removeAllListeners();

        // on socket disconnect
        client.socket.on(SOCKETEVENTS.DISCONNECT, function(){
            client.disconnected = true;
            console.log("Client", client.name, "disconnected, don't know what to do, trying to stop");
            this.pause();
        }.bind(this));


        this.activity.addParticipant(client);

        // HANDLE NEW INPUT
        client.socket.on(SOCKETEVENTS.ACTIVITY.NEW_INPUT, function(data){
            this.activity.setUpdatedInput(client, data);
        }.bind(this));

    };

    clients.forEach(_handleClientFunc.bind(this));

};


/**
 * Initiates and starts a session and the depending activity
 */
Session.prototype.start = function start() {

    var clientNames = this.clients.map(function (client) {
        return client.name;
    });
    console.log("#Session: started with those clients:", clientNames);

    // now that the activity is set up, send the initial status to the clients
    this.clients.forEach(function(client){
        var viewData = this.activity.getInitView();
        client.socket.emit(SOCKETEVENTS.ACTIVITY.INIT_VIEW, viewData);
    }.bind(this));


    console.log("#Session: starting update view routine");
    this._intervalReference = setInterval(this._update.bind(this), this.updateInterval);

};



/**
 * This gets executed periodically and updates the clients view with the activity data
 * @private
 */
Session.prototype._update = function(){

    this.activity.processTick();

    var viewData = this.activity.getUpdateView();

    if(!viewData) return;

    //console.log("#Session: Updating clients with new view", Object.keys(this.clients));

    this.clients.forEach(function(client){
        client.socket.emit(SOCKETEVENTS.ACTIVITY.UPDATE_VIEW, viewData);
    }.bind(this));

};


/**
 * Interrupts the session if someone leaves
 * TODO need a way to detect rejoining users and re-start session
 */
Session.prototype.pause = function(){
    if(!this._intervalReference) {
        console.log("#Session: can't stop session that isnt running");
        return;
    }
    console.log("#Session: Clearing session update interval!");
    clearInterval(this._intervalReference);
    delete this._intervalReference;
};




module.exports = Session;