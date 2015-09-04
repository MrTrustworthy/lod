var Game = require("./game");
var logger = require("../utils/mt-log")("main-log");


var handlerFunctions = {
    end_turn: function () {
        this.game.players.push(this.game.players.shift());
    },
    build: function (player, params) {
        //console.log("calling function with params:", arguments);
        // params are like {x: 5, y: 10}
        this.game.build(player, params);
    }
};



/**
 *
 * @param gameConfig
 * @constructor
 */
var GameHandler = function (gameConfig) {
    this.game = new Game(gameConfig);
};

/**
 *
 * @param player
 * @param command
 * @param params
 * @returns {boolean}
 */
GameHandler.prototype.handleCommand = function (player, command, params) {
    params = params || {};

    console.log("#GameHandler: handling command", command, "for player", player, "with args", params);
    if (!this.isTurnOf(player)) {
        console.log("Player", player, "is not on turn now!");
        return false;
    }
    try {
        handlerFunctions[command].call(this, player, params);
        return true;
    } catch (e) {
        console.log("#Gamehandler: Sending a command went wrong and caused an error:", e.toString());
        return false;
    }

};


/**
 *
 * @param playerName
 * @returns {boolean}
 */
GameHandler.prototype.isTurnOf = function (playerName) {
    return this.game.players[0].name === playerName;
};

/**
 *
 * @returns {{map: (string|*|Object|String|{position, object, ressource}|{name, ressources}), players: (Array|*), turnOf: *}|*}
 */
GameHandler.prototype.getInitView = function () {
    var map, players, turnOf, json;

    map = this.game.map.toJSON();
    players = this.game.players.map(function (player) {
        return player.toJSON();
    });

    turnOf = this.game.players[0].name;

    json = {
        map: map,
        players: players,
        turnOf: turnOf
    };
    //console.log("#Gamehandler: view looks like this", json);
    return json;
};

/**
 *
 * @returns {{demo: string}}
 */
GameHandler.prototype.getViewUpdate = function () {
    return this.getInitView();
};




module.exports = GameHandler;