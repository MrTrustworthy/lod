var WorldMap = require("./map");
var Player = require("./player");
var RG = require("./ressourcegenerator");
var WorldObject = require("./worldobject");
var CommandError = require("../utils/commanderror");


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


    // Find coordinates for the players bases
    var baseCoords = this.map.getStartingPoints(this.players.length);
    if (baseCoords.length !== this.players.length) {
        throw new Error("Mismatch!");
    }

    // create the players bases and place them
    this.players.forEach(function (player, i) {
        var startingField = this.map.get(baseCoords[i].x, baseCoords[i].y);
        var playerBase = new WorldObject(WorldObject.TYPES.BASE);
        player.addObject(playerBase);
        startingField.placeObject(playerBase);
    }.bind(this));

};

/**
 *
 * @param name
 * @returns {Player}
 */
Game.prototype.getPlayer = function (name) {
    var player = this.players.filter(function (p) {
        return p.name === name;
    })[0];

    if (!player) {
        throw new CommandError("No player with that name!", name);
    }
    return player;
};

/**
 *
 * @param player
 * @param args
 */
Game.prototype.attack = function (player, args) {
    var originField,
        originObj,
        targetField,
        targetObj;


    // check possible abort cases and create useful error messages
    try { //#1: Fields cant be found
        originField = this.map.get(args.origin.x, args.origin.y);
        originObj = originField.object;
        targetField = this.map.get(args.target.x, args.target.y);
        targetObj = targetField.object;
    } catch (e) {
        throw new CommandError("Couldn't locate one of the fields:", args);
    }
    if (!this.map.areAdjacent(originField, targetField)) { //#2: Fields are not adjacent
        throw new CommandError("Fields are not adjacent:", args);
    } else if (originObj.owner.name !== player) { //#3: player tries to attack from other players object (cheat?)
        throw new CommandError(player, "can't start attack from object of", originObj.owner.name);
    } else if (originObj.owner.name === targetObj.owner.name) { //#4: Player tries to attack own object or self
        throw new CommandError("Can't attack own objects!");
    } else if (originObj.attack === 0) { //#5: Player tries to attack with a street -.-
        throw new CommandError("Can't with an object that has no attack value!");
    }

    console.log("#Game: trying to attack:");
    console.log(player, "->", args);

    targetObj.hit(originObj.attack);
    originObj.hit(targetField.attack);
};


/**
 *
 * @param playerName
 * @param where something like {x: 2, y: 2}
 */
Game.prototype.build = function (playerName, where) {
    var obj, field, player;

    field = this.map.get(where.x, where.y);

    // check if field exists
    if (!field) {
        throw new CommandError("This field doesnt exist", where, ":::", this.map);
        // check if field is free
    } else if (!!field.object) {
        throw new CommandError("Already have object on", field.toString());
    } else {
        // check if the player owns a neighboring field, else dont build
        var adjacentOwnedFields = this.map.adjacentTo(field).filter(function (fld) {
            return fld.object && fld.object.owner.name === playerName;
        });
        if (adjacentOwnedFields.length === 0) {
            throw new CommandError("Player", playerName, "cant build on field he has no connection to at", where);
        }
    }

    // if everything went fine, try to withdraw ressources
    player = this.getPlayer(playerName);
    player.removeRessources({name: RG.RES.BUILD, value: 1});

    // no errors so far? fine, i guess we'll build it then
    obj = new WorldObject(WorldObject.TYPES.STREET);
    player.addObject(obj);
    field.placeObject(obj);
};


/**
 * Shifts the player order and adds ressources from player occupied fields to the player
 */
Game.prototype.endTurn = function () {
    var res,
        currPlayer = this.players.shift();

    currPlayer.objects.forEach(function (obj) {
        // withdraw ressource from field
        res = obj.field.fetchRessource();
        // add it to the players pool
        currPlayer.addRessource(res);
    });
    this.players.push(currPlayer);
};


module.exports = Game;
