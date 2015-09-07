//var WorldObject = require("./worldobject");
var Ressource = require("./ressourcegenerator");
var CommandError = require("../utils/commanderror");

/**
 *
 * @param name
 * @constructor
 */
var Player = function (name) {
    this.name = name || "Default Player";
    this.ressources = {};
    this.ressources[Ressource.TYPES.BUILD] = new Ressource(Ressource.TYPES.BUILD, 4);
    this.ressources[Ressource.TYPES.ATTACK] = new Ressource(Ressource.TYPES.ATTACK, 4);
    this.ressources[Ressource.TYPES.SHIELD] = new Ressource(Ressource.TYPES.SHIELD, 4);

    this.objects = [];
};

/**
 *
 * @param object
 */
Player.prototype.addObject = function (object) {
    this.objects.push(object);
    object.owner = this;
};

/**
 *
 * @param object
 */
Player.prototype.removeObject = function (object) {
    var i = this.objects.indexOf(object);
    if (i === -1) throw new Error("#PLAYER: CRITICAL: player doesn't have this object?!");
    this.objects.splice(i, 1);
};


/**
 *
 * @param res
 */
Player.prototype.addRessource = function (res) {
    if(!res) return;
    this.ressources[res.name].add(res);
};

/**
 *
 * @param res
 * @returns
 */
Player.prototype.removeRessources = function (res) {
    if(!res) return;

    res = (res instanceof Array) ? res : [res];

    // check if we have enough ressources
    var enough = res.every(function (ressource) {
        return this.ressources[ressource.name].canSub(ressource.amount);
    }.bind(this));

    if (!enough) {
        throw new CommandError("Not enough ressources!");
    }

    res.forEach(function (ressource) {
        this.ressources[ressource.name].sub(ressource.value);
    }.bind(this));

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