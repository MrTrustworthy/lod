var Game = require("./game");
//var logger = require("../utils/mt-log")("main-log");
var CommandError = require("../utils/commanderror");

/**
 *
 * @param gameConfig
 * @constructor
 */
var GameHandler = function (gameConfig) {
    this.game = new Game(gameConfig);

    this.handlerFunctions = {
        end_turn: this.game.endTurn.bind(this.game),
        build: this.game.build.bind(this.game),
        attack: this.game.attack.bind(this.game)
    };

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
        throw new CommandError("Player", player, "is not on turn now!");
    }

    this.handlerFunctions[command].call(this, player, params);

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
 * @returns
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