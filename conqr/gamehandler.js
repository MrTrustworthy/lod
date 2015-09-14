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









module.exports = GameHandler;