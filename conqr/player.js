var WorldObject = require("./worldobject");
var RG = require("./ressourcegenerator");
var CommandError = require("../utils/commanderror");

/**
 *
 * @param name
 * @constructor
 */
var Player = function (name) {
    this.name = name || "Default Player";
    this.ressources = RG.getStartingRessources();
    this.objects = [];
};

/**
 *
 * @param object
 */
Player.prototype.addObject = function(object){
    this.objects.push(object);
    object.owner = this;
};

/**
 *
 * @param object
 */
Player.prototype.removeObject = function(object){
    var i = this.objects.indexOf(this);
    if(i === -1) throw new Error("#PLAYER: CRITICAL: player doesn't have this object?!");
    this.objects.splice(i, 1);
};


/**
 *
 * @param res
 */
Player.prototype.addRessource = function (res) {
    this.ressources[res.name] += res.amount;
};

/**
 *
 * @param res
 * @returns {boolean}
 */
Player.prototype.removeRessources = function (res) {

    res = (res instanceof Array) ? res : [res];

    // check if we have enough ressources
    var enough = res.every(function (ressource) {
        return (this.ressources[ressource.name] - ressource.value) >= 0;
    }.bind(this));
    if (!enough) {
        throw new CommandError("Not enough ressources!");
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
Player.prototype.toJSON = function () {
    //var objects = this.objects.map(function (obj) {
    //    return obj.toJSON();
    //});
    return {
        name: this.name,
        ressources: this.ressources
        //objects: objects
    };
};

module.exports = Player;