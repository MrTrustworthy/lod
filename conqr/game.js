var WorldMap = require("./map");
var Player = require("./player");
var Ressource = require("./ressource");
var WorldObject = require("./worldobject");
var CommandError = require("../utils/commanderror");
var SOCKETEVENTS = require("../shared/socketevents");
var EventHandler = require("../shared/js/mt-event");


/**
 *
 * @param config
 * @constructor
 */
var Game = function (config) {

    EventHandler.makeEvented(this);

    this.map = new WorldMap(config.worldSize);

    this.players = config.players.map(function(playerName){
        return new Player(playerName);
    });


    // Find coordinates for the players bases
    var baseCoords = this.map.getStartingPoints(this.players.length);
    if (baseCoords.length !== this.players.length) throw new Error("Mismatch!");


    // create the players bases and place them
    this.players.forEach(function (player, i) {
        var startingField = this.map.get(baseCoords[i].x, baseCoords[i].y);
        var playerBase = new WorldObject(WorldObject.TYPES.BASE);
        player.addObject(playerBase);
        startingField.placeObject(playerBase);
        playerBase.on(SOCKETEVENTS.OBJECTS.OBJECT_DESTROYED, this.eliminatePlayer.bind(this));
    }.bind(this));

};


/**
 * Eliminates a player from the game
 * @param object
 */
Game.prototype.eliminatePlayer = function(object){
    object.owner.eliminate();

    var active = this.players.filter(function(player){
        return !player.isEliminated;
    });

    if(active.length <= 1) this.endGame();
};

/**
 * Emits end-game-event
 */
Game.prototype.endGame = function(){
    this.emit(SOCKETEVENTS.GAME_ENDED, this);
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
 * @param playerName
 * @returns {boolean}
 */
Game.prototype.isTurnOf = function (playerName) {
    return this.players[0].name === playerName;
};

/* ---------------------------------------------------
--------------------COMMAND FUNCTIONS-----------------
------------------------------------------------------ */


/**
 *
 * @param player
 * @param command
 * @param params
 * @returns {boolean}
 */
Game.prototype.handleCommand = function (player, command, params) {
    params = params || {};

    var exposedCommands = {
        build: this.build,
        end_turn: this.endTurn,
        attack: this.attack,
        improve: this.improve
    };

    console.log("#Game: handling command", command, "for player", player, "with args", params);
    if (!this.isTurnOf(player)) {
        throw new CommandError("Player", player, "is not on turn now!");
    } else if (player.isEliminated){
        throw new CommandError("Player", player, "is already eliminated and can't act!");
    }

    exposedCommands[command].call(this, player, params);

};


/**
 *
 * @param player
 * @param params
 */
Game.prototype.attack = function (player, params) {
    var originField,
        originObj,
        targetField,
        targetObj;


    // check possible abort cases and create useful error messages
    try { //#1: Fields cant be found
        originField = this.map.get(params.origin.x, params.origin.y);
        originObj = originField.object;
        targetField = this.map.get(params.target.x, params.target.y);
        targetObj = targetField.object;
    } catch (e) {
        throw new CommandError("Couldn't locate one of the fields:", params);
    }
    if (!this.map.areAdjacent(originField, targetField)) { //#2: Fields are not adjacent
        throw new CommandError("Fields are not adjacent:", params);
    } else if (originObj.owner.name !== player) { //#3: player tries to attack from other players object (cheat?)
        throw new CommandError(player, "can't start attack from object of", originObj.owner.name);
    } else if (originObj.owner.name === targetObj.owner.name) { //#4: Player tries to attack own object or self
        throw new CommandError("Can't attack own objects!");
    } else if (originObj.attack === 0) { //#5: Player tries to attack with a street -.-
        throw new CommandError("Can't with an object that has no attack value!");
    } else if(originObj.hasAttacked){ //#6: Player already has attacked with the object this round
        throw new CommandError("Can't attack twice a round with the same object");
    }

    //console.log("#Game: trying to attack:");
    //console.log(originObj.toString(), "->", targetObj.toString());

    targetObj.hit(originObj.attack);
    originObj.hasAttacked = true;

    originObj.hit(targetObj.attack);
};


/**
 * Improves a object of the players attack or shield by 1
 * @param playerName
 * @param params
 */
Game.prototype.improve = function(playerName, params){

    var field, player, where, type;

    //params = {
    //    position: {
    //        x: 10,
    //        y: 10
    //    },
    //    type: "shield"
    //};

    console.info("#Game: Calling improve with params:", params);

    try {
        where = params.position;
        type = params.type;
        // is already errorchecked
        field = this.map.get(where.x, where.y);
    }catch(e){
        if(e instanceof CommandError) throw e;
        throw new CommandError("The passed command contains invalid parameters");
    }

    if(type !== WorldObject.VALUES.ATTACK && type !== WorldObject.VALUES.SHIELD){
        throw new CommandError("Can't improve Object with other value than 'shield' or 'attack'");
    } else if (!field) {// check if field exists
        throw new CommandError("This field doesnt exist", where, ":::", this.map);
        // check if field is free
    } else if (!field.object) {
        throw new CommandError("There is no object on this field to improve", field.toString());
    }else if (field.object.owner.name !== playerName){
        throw new CommandError("The object on this field doesn't belong to the player");
    } else if (field.object.name !== WorldObject.TYPES.TURRET.name){
        throw new CommandError("Can't improve Object that isn't a turret!");
    }

    // if everything went fine, try to withdraw ressources
    player = this.getPlayer(playerName);
    player.removeRessources(new Ressource(Ressource.TYPES[params.type], 1));
    field.object.improve(params.type);

};


/**
 *
 * @param playerName
 * @param params something like {x: 2, y: 2}
 */
Game.prototype.build = function (playerName, params) {
    var obj, field, player, where, type, typeObj;

    console.log("#Game: calling 'build' with the parameters:", params);

    try {
        where = params.position;
        type = params.type;
        // is already errorchecked
        field = this.map.get(where.x, where.y);
    }catch(e){
        if(e instanceof CommandError) throw e;
        throw new CommandError("The passed command contains invalid parameters");
    }

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
    player.removeRessources(new Ressource(Ressource.TYPES.BUILD, 1));

    // check if we have this kind of object
    typeObj = WorldObject.TYPES[type.toUpperCase()];
    if(!typeObj) throw new CommandError("Object with Type", type, "does not exist!");

    // no errors so far? fine, i guess we'll build it then
    obj = new WorldObject(typeObj);
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
        // reset the objects "hasAttacked" state
        obj.hasAttacked = false;
        // withdraw ressource from field
        res = obj.field.fetchRessource();
        // add it to the players pool
        currPlayer.addRessource(res);
    });
    this.players.push(currPlayer);
};


/* ----------------------------------------------------
 --------------------VIEW HANDLING STUFF---------------
 ------------------------------------------------------ */

/**
 *
 * @returns {{map: (Array|*), players: *, turnOf: *}}
 */
Game.prototype.getInitView = function () {
    var map, players, turnOf;

    map = this.map.toJSON();
    players = this.players.map(function (player) {
        return player.toJSON();
    });

    turnOf = this.players[0].name;

    return {
        map: map,
        players: players,
        turnOf: turnOf
    };
};

/**
 *
 * @returns {{map, players, turnOf}}
 */
Game.prototype.getViewUpdate = function () {
    return this.getInitView();
};



module.exports = Game;
