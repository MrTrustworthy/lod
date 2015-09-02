/**
 * Created by MrTrustworthy on 03.08.2015.
 */

var Visuals = require("./visuals");
var SOCKETEVENTS = require("../socketevents");
var UI = require("./ui");
var InputManager = require("./inputmanager");

/**
 *
 * @constructor
 */
var Game = function (socket) {


    this.ui = new UI();
    this.visuals = new Visuals();
    this.inputManager = new InputManager(socket);

    socket.on(SOCKETEVENTS.ACTIVITY.INIT_VIEW, this.visuals.initView.bind(this.visuals));
    socket.on(SOCKETEVENTS.ACTIVITY.INIT_VIEW, this.ui.updatePlayerData.bind(this.ui));

    socket.on(SOCKETEVENTS.ACTIVITY.UPDATE_VIEW, this.visuals.updateView.bind(this.visuals));
    socket.on(SOCKETEVENTS.ACTIVITY.UPDATE_VIEW, this.ui.updatePlayerData.bind(this.ui));

    this.visuals.on(SOCKETEVENTS.CLIENT.CLICKED_ON_OBJECT, this.inputManager.handleClick.bind(this.inputManager));
    this.ui.on(SOCKETEVENTS.CLIENT.CLICKED_END_TURN, this.inputManager.sendEndTurn.bind(this.inputManager));

};


/**
 *
 * @param socket
 */
Game.prototype.start = function () {
    this.visuals.startRenderLoop();

};

module.exports = Game;