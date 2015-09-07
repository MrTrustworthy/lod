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
    if (this.object) throw new CommandError("#Field: CRITICAL:Already have object on", this.toString());

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
 * @returns amount of ressource fetched, or none
 */
Field.prototype.fetchRessource = function (fetchAmount) {
    if (!this.ressource) return null;

    fetchAmount = fetchAmount || 1;

    var ressource = this.ressource.sub(fetchAmount);
    if (this.ressource.amount <= 0) this.ressource = null;
    return ressource;
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

