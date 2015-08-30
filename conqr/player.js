var WorldObject = require("./worldobject");
var RG = require("./ressourcegenerator");

/**
 *
 * @param name
 * @constructor
 */
var Player = function (name) {

    this.name = name || "Default Player";

    this.ressources = RG.getStartingRessources();

    this.base = new WorldObject(this, 0, 3);

    this.objects = [this.base];

};

/**
 *
 * @param res
 * @returns {boolean}
 */
Player.prototype.removeRessources = function (res) {

    res = (res instanceof Array) ? res : [res];


    var enough = res.every(function (ressource) {
        return (this.ressources[ressource.name] - ressource.value) >= 0;
    }.bind(this));
    if (!enough) {
        throw new Error("Not enough ressources!");
    }

    res.forEach(function (ressource) {
        this.ressources[ressource.name] -= ressource.value;
    }.bind(this));

    return true;
};

/**
 *
 * @returns {{name: *, ressources: *}}
 */
Player.prototype.toJSON = function(){
    return {
        name: this.name,
        ressources: this.ressources
    };
};

module.exports = Player;