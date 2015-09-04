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
    socket.on(SOCKETEVENTS.ACTIVITY.INIT_VIEW, this.ui.updateInfoPane.bind(this.ui));

    socket.on(SOCKETEVENTS.ACTIVITY.UPDATE_VIEW, this.visuals.updateView.bind(this.visuals));
    socket.on(SOCKETEVENTS.ACTIVITY.UPDATE_VIEW, this.ui.updateInfoPane.bind(this.ui));

    socket.on(SOCKETEVENTS.MESSAGE, function (message) {
        console.info("MESSAGE FROM SERVER:", message);
    });

    this.visuals.on(SOCKETEVENTS.CLIENT.CLICKED_ON_OBJECT, this.inputManager.handleClick.bind(this.inputManager));
    this.visuals.on(SOCKETEVENTS.CLIENT.CLICKED_RIGHT, this.inputManager.clearSelection.bind(this.inputManager));

    //this.ui.on(SOCKETEVENTS.CLIENT.CLICKED_END_TURN, this.inputManager.sendEndTurn.bind(this.inputManager));
    this.inputManager.on(SOCKETEVENTS.CLIENT.SELECTION_CHANGED, this.ui.updateActionPane.bind(this.ui));
    this.ui.on(SOCKETEVENTS.CLIENT.CLICKED_ON_ACTION, this.inputManager.handleUICommand.bind(this.inputManager));


};


/**
 *
 * @param socket
 */
Game.prototype.start = function () {
    this.visuals.startRenderLoop();

};

module.exports = Game;