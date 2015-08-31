/**
 * Created by MrTrustworthy on 03.08.2015.
 */

var Visuals = require("./visuals");
var SOCKETEVENTS = require("../socketevents");
var UI = require("./ui");

/**
 *
 * @constructor
 */
var Game = function () {

    this.ui = new UI();
    this.visuals = new Visuals();

};

Game.prototype.loadInputHandling = function (socket) {

    this.visuals.on(SOCKETEVENTS.CLIENT.CLICKED_ON_OBJECT, function (data) {
        console.log("GOT DATA TO HANDLE:", data);
    }.bind(this));

    this.ui.on(SOCKETEVENTS.CLIENT.END_TURN, function () {
        console.log("#Game: Sending end turn signal");
        socket.emit(SOCKETEVENTS.ACTIVITY.NEW_INPUT, {
            command: SOCKETEVENTS.COMMAND.END_TURN,
            params: {}
        });
    }.bind(this));


};


/**
 *
 * @param socket
 */
Game.prototype.start = function (socket) {


    socket.on(SOCKETEVENTS.ACTIVITY.INIT_VIEW, this.visuals.initView.bind(this.visuals));
    socket.on(SOCKETEVENTS.ACTIVITY.UPDATE_VIEW, this.visuals.updateView.bind(this.visuals));

    socket.on(SOCKETEVENTS.ACTIVITY.INIT_VIEW, this.ui.update.bind(this.ui));
    socket.on(SOCKETEVENTS.ACTIVITY.UPDATE_VIEW, this.ui.update.bind(this.ui));

    this.visuals.startRenderLoop();
    this.loadInputHandling(socket);
};

module.exports = Game;