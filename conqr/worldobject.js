var Evented = require("../shared/js/mt-event");
var SOCKETEVENTS = require("../shared/socketevents");
var CommandError = require("../utils/commanderror");
/**
 *
 * @param type
 * @constructor
 */
var WorldObject = function (type) {

    Evented.makeEvented(this);

    this.name = type.name;
    this.attack = type.attack;
    this.shield = type.shield;

    // gets set by the player object
    this.owner = null;

    // gets set by the field object
    this.field = null;

    // need that so an object can't attack twice a round
    // don't forget to reset this after each round!!
    this.hasAttacked = false;
};

WorldObject.VALUES = {
    ATTACK: "attack",
    SHIELD: "shield"
};

/**
 *
 * @type {Object}
 */
WorldObject.TYPES = {
    BASE: {
        name: "Base",
        attack: 1,
        shield: 3
    },
    STREET: {
        name: "street",
        attack: 0,
        shield: 0
    },
    TURRET: {
        name: "turret",
        attack: 1,
        shield: 1
    }
};

/**
 * Improves the worldobject
 * @param value
 */
WorldObject.prototype.improve = function(value){

    // those error checks are kinda duplicated from game.improve
    if(this.name !== WorldObject.TYPES.TURRET.name){
        throw new CommandError("Can't improve Object that isn't a turret!");
    }
    if(value !== WorldObject.VALUES.ATTACK && value !== WorldObject.VALUES.SHIELD){
        throw new CommandError("Can't improve Object with other value than 'shield' or 'attack'");
    }

    this[value]++;

};


/**
 *
 * @param damage
 */
WorldObject.prototype.hit = function(damage){
    if(typeof damage !== "number") console.log("#ERROR: damage is no valid number", damage);
    this.shield -= damage;
    if(this.shield < 0) this.destroy();
};



/**
 *
 */
WorldObject.prototype.destroy = function(){
    this.emit(SOCKETEVENTS.OBJECTS.OBJECT_DESTROYED, this);
    this.field.removeObject();
    this.owner.removeObject(this);
};


/**
 *
 * @returns {string}
 */
WorldObject.prototype.toString = function () {
    return "<" + this.owner.name + "(" + this.attack + ":" + this.shield + ")>";
};


/**
 *
 * @returns {{owner: *, attack: *, shield: *}}
 */
WorldObject.prototype.toJSON = function () {
    return {
        owner: this.owner,
        attack: this.attack,
        shield: this.shield
    };
};


/**
 *
 * @type {Function}
 */
module.exports = WorldObject;