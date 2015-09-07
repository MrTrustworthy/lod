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


    // attack if we are in attack mode
    if (this.isInAttackMode) {

        console.warn("#Inputmanager: IN ATTACK MODE, ATTACKING:", field, "from", this.selected);

        // send attack command
        this.socket.emit(
            SOCKETEVENTS.ACTIVITY.NEW_INPUT, {
                command: SOCKETEVENTS.COMMAND.ATTACK,
                params: {
                    origin: this.selected.position,
                    target: field.position
                }
            }

        );
        // clear UI
        this.isInAttackMode = false;
        this.select(null);
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

    // if the command is "attack", just trigger attack mode and be done
    if (input === SOCKETEVENTS.COMMAND.ATTACK) {
        this.isInAttackMode = true;
        return;
    }

    var getCommand = function (input) {

        if (input === SOCKETEVENTS.COMMAND.BUILD_STREET) {
            return {
                command: SOCKETEVENTS.COMMAND.BUILD,
                params: {
                    type: SOCKETEVENTS.OBJECTS.STREET,
                    position: this.selected.position
                }
            };
        }
        if (input === SOCKETEVENTS.COMMAND.BUILD_TURRET) {
            return {
                command: SOCKETEVENTS.COMMAND.BUILD,
                params: {
                    type: SOCKETEVENTS.OBJECTS.TURRET,
                    position: this.selected.position
                }
            };
        }
        if (input === SOCKETEVENTS.COMMAND.END_TURN) {
            return {
                command: input,
                params: {}
            };
        }
        if (input === SOCKETEVENTS.COMMAND.IMPROVE) {
            return {
                command: input,
                params: this.selected.position
            };
        }


        throw new Error("No Command Matched for input!", input);

    };


    this.socket.emit(SOCKETEVENTS.ACTIVITY.NEW_INPUT, getCommand.call(this, input));

};


module.exports = InputManager;