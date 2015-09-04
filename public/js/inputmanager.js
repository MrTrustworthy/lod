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

    this.isInAttackMode = false;
};


InputManager.prototype.clearSelection = function () {
    this.select(null);
    this.isInAttackMode = false;
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

    console.info("#Inputmanager: clicked on:", field);

    if (this.isInAttackMode) {
        console.warn("#Inputmanager: IN ATTACK MODE, ATTACKING:", field);
        return;
    }


    this.select(field);
};

/**
 * Set the selected element to something
 * @param field
 */
InputManager.prototype.select = function (field) {
    this.selected = field;
    this.emit(SOCKETEVENTS.CLIENT.SELECTION_CHANGED, this.selected);
};


/**
 *
 * @param input
 */
InputManager.prototype.handleUICommand = function (input) {
    console.log("#Inputmanager: wants to send command with:", input);
    //debugger;

    var buildCommandObject = function (command) {

        if (command === SOCKETEVENTS.COMMAND.BUILD) {
            return {
                command: command,
                params: this.selected.position
            };
        }
        if (command === SOCKETEVENTS.COMMAND.END_TURN) {
            return {
                command: command,
                params: {}
            };
        }
        if (command === SOCKETEVENTS.COMMAND.IMPROVE) {
            return {
                command: command,
                params: this.selected.position
            };
        }
        if (command === SOCKETEVENTS.COMMAND.ATTACK) {
            this.isInAttackMode = true;
            return;
        }

        throw new Error("No Command Matched for input!", input);

    };


    this.socket.emit(SOCKETEVENTS.ACTIVITY.NEW_INPUT, buildCommandObject.call(this, input));

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