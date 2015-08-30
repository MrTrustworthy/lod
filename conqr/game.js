var WorldMap = require("./map");
var Player = require("./player");
var RG = require("./ressourcegenerator");
var WorldObject = require("./worldobject");


/**
 *
 * @param config
 * @constructor
 */
var Game = function (config) {

    this.map = new WorldMap(config.worldSize);

    this.players = [];

    config.players.forEach(function (playerName) {
        this.players.push(new Player(playerName));
    }.bind(this));


    // Find coordinates for the players bases and put them on the map
    var baseCoords = this.map.getStartingPoints(this.players.length);
    if (baseCoords.length !== this.players.length) {
        throw new Error("Mismatch!");
    }
    this.players.forEach(function (player, i) {
        var startingField = this.map.get(baseCoords[i].x, baseCoords[i].y);
        //console.log("#Game: placing object:", player.base.toString(), "on", startingField);
        startingField.placeObject(player.base);
    }.bind(this));

};

/**
 *
 * @param name
 * @returns {T}
 */
Game.prototype.getPlayer = function (name) {
    var player = this.players.filter(function (p) {
        return p.name === name;
    })[0];

    if (!player) {
        throw new Error("No player with that name!");
    }
    return player;
};

/**
 *
 * @param playerName
 * @param where
 */
Game.prototype.build = function (playerName, where) {
    var obj, field, player;

    field = this.map.get(where.x, where.y);
    if (!field) {
        throw new Error("This field doesnt exist", where, ":::", this.map);
    }

    player = this.getPlayer(playerName);
    player.removeRessources({name: RG.RES.BUILD, value: 1});

    obj = new WorldObject(player, 1, 1);
    player.objects.push(obj);
    field.placeObject(obj);
};


module.exports = Game;
