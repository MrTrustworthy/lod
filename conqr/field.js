var RG = require("./ressourcegenerator");
var CommandError = require("../utils/commanderror");
/**
 *
 * @param position
 * @constructor
 */
var Field = function (position) {

    this.position = position;

    this.ressource = Math.random() > 0.3 ? RG.get() : null;

    this.object = null;

};

/**
 *
 * @param obj
 */
Field.prototype.placeObject = function (obj) {
    if (this.object) {
        console.error("#Field:CRITICAL: Already have object on", this.toString());
        throw new Error("#Field: CRITICAL:Already have object on", this.toString());
    }
    this.object = obj;
    obj.field = this;
};

/**
 *
 */
Field.prototype.removeObject = function () {
    this.object = null;
};

/**
 *
 * @param other
 * @returns {boolean}
 */
Field.prototype.equals = function(other){
    return this.position.x === other.position.x && this.position.y === other.position.y;
};

/**
 *
 * @param amount
 */
Field.prototype.fetchRessource = function (fetchAmount) {
    if (!this.ressource) return false;

    var amount, returnValue;

    fetchAmount = fetchAmount || 1;

    amount = Math.min(fetchAmount, this.ressource.amount);
    returnValue = RG.get(this.ressource.name, amount);

    this.ressource.amount -= amount;
    if (this.ressource.amount <= 0) this.ressource = null;


    return returnValue;

};

/**
 *
 * @returns {string}
 */
Field.prototype.toString = function () {
    var obj = this.object ? this.object.toString() : "None";
    return "[(" + this.position.x + ":" + this.position.y + ")" + this.ressource + "/" + obj + "]";
};
/**
 *
 * @returns {{position: *, object: *, ressource: *}}
 */
Field.prototype.toJSON = function () {
    return {
        position: this.position,
        object: this.object ? this.object.toJSON() : null,
        ressource: this.ressource ? this.ressource.toJSON() : null
    };
};

module.exports = Field;

