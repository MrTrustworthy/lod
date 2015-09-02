var SOCKETEVENTS = require("../socketevents");
var EventManager = require("./mt-event");
/**
 *
 * @constructor
 */
var InputManager = function (socket) {
    EventManager.makeEvented(this);
    this.socket = socket;
    this.selected = null;
};

/**
 *
 * @param object
 */
InputManager.prototype.handleClick = function (object) {

    var field;

    if (!object) {
        console.error("#Inputmanager: Clicked on a not existing object");
        return;
    }

    try {
        field = object[0].object.userData;
    } catch (e) {
        console.error("#Inputmanager: couldn't evaluate click on", object);
        return;
    }

    this.setSelected(field);
};

/**
 *
 * @param value
 */
InputManager.prototype.setSelected = function (field) {
    console.info("#Inputmanager: clicked on:", field);
    this.selected = field;
    this.emit(SOCKETEVENTS.CLIENT.SELECTION_CHANGED, this.selected);

    //this.socket.emit(SOCKETEVENTS.ACTIVITY.NEW_INPUT, {
    //    command: SOCKETEVENTS.COMMAND.BUILD,
    //    params: field.position
    //});
};

InputManager.prototype.handleUIClick = function(input){

    this.socket.emit(SOCKETEVENTS.ACTIVITY.NEW_INPUT, {
        command: SOCKETEVENTS.COMMAND.BUILD,
        params: input.field.position
    });

};

/**
 *
 */
InputManager.prototype.sendEndTurn = function () {
    console.log("#InputManager: Sending end turn signal");
    this.socket.emit(SOCKETEVENTS.ACTIVITY.NEW_INPUT, {
        command: SOCKETEVENTS.COMMAND.END_TURN,
        params: {}
    });
};

module.exports = InputManager;