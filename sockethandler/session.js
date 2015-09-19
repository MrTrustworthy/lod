var logger = require("../utils/mt-log")("main-log");
var SOCKETEVENTS = require("../shared/socketevents");
//var Activity = require("../activities/activity");
var Game = require("../conqr/game");
var CommandError = require("../utils/commanderror");
var EventHandler = require("../shared/js/mt-event");


var Session = function Session(clients) {
    var clientNames, gameConf;

    EventHandler.makeEvented(this);

    this.clients = clients instanceof Array ? clients : [clients];
    clientNames = this.loadClients();

    // create Game instance
    gameConf = {
        players: clientNames,
        worldSize: {
            x: 20,
            y: 20
        }
    };

    // TODO make the config dynamically/constant/something to avoid having a demo config here
    this.game = new Game(gameConf);

    // once the game reaches a end-situation, it will emit a corresponding event and the session will handle it
    this.game.on(SOCKETEVENTS.GAME_ENDED, this.handleGameEnd.bind(this));

    // send init view to clients after setting up
    this.clients.forEach(function (client) {
        client.socket.emit(SOCKETEVENTS.ACTIVITY.INIT_VIEW, this.game.getInitView());
    }.bind(this));
};

/**
 * Adds some clients to the session.
 * This sets up the clients to communicate commands and disconnects to the game.
 *
 *
 */
Session.prototype.loadClients = function () {
    var clientNames = this.clients.map(function (client) {
        return client.name;
    });


    this.clients.forEach(function (client) {

        // tell the clients we started the session
        client.socket.emit(
            SOCKETEVENTS.SESSION_START,
            {
                message: "Starting Game-Session now",
                clients: clientNames
            }
        );

        client.socket.removeAllListeners();

        // on socket disconnect
        client.socket.on(SOCKETEVENTS.DISCONNECT, function () {
            logger.log("#Session: Client", client.name, "disconnected, eliminating him from the game");
            var player = this.game.players.filter(function (p) {
                return p.name === client.name;
            })[0];
            if (!player) throw new Error("#Session: ERROR: Can't disconnect player", client.name);
            // FIXME this is a workaround because game.eliminatePlayer wants an object ;P
            this.game.eliminatePlayer(player.objects[0]);

        }.bind(this));

        // HANDLE NEW INPUT
        client.socket.on(SOCKETEVENTS.ACTIVITY.NEW_INPUT, function (input) {
            this.handleClientInput(client, input);
        }.bind(this));

    }.bind(this));


    return clientNames;

};

/**
 * Updates the game and then sends a update to all clients with the changes
 * @param client
 * @param clientInput needs to look like:
 *      {
 *          command: "build",
 *          args: "{\"x\": 0, \"y\": 0}"
 *      }
 */
Session.prototype.handleClientInput = function (client, clientInput) {

    var clientName = client.name;

    //console.log("#Session: Sending updated input for", clientName, ":", clientInput);
    try {
        this.game.handleCommand(clientName, clientInput.command, clientInput.params);
    } catch (e) {
        if (e instanceof CommandError) {
            console.error("#Session: Error when handling", clientInput, "for", clientName, ", handling it!");
            client.socket.emit(SOCKETEVENTS.MESSAGE, {type: "error", info: e.message});
        } else {
            console.error("#Session: CRITICAL! NOT RECOGNIZED ERROR! THIS SHOULD NOT HAPPEN!");
            throw e;
        }
        return;
    }

    // update both clients with a new view because something probably has changed
    logger.log("#Session: Updating clients with new view", Object.keys(this.clients));
    this.clients.forEach(function (client) {
        client.socket.emit(SOCKETEVENTS.ACTIVITY.UPDATE_VIEW, this.game.getViewUpdate());
    }.bind(this));

};

/**
 *
 * @param game
 */
Session.prototype.handleGameEnd = function (game) {
    var winners = game.players.filter(function (player) {
        return !player.isEliminated;
    });
    console.log("#Session: Game has", winners.length, "winners!");

    var winnerName = winners[0] ? winners[0].name : "Nobody";

    this.clients.forEach(function(client){
        client.socket.emit(SOCKETEVENTS.GAME_ENDED, winnerName);
        client.socket.removeAllListeners();
    }.bind(this));

    this.emit(SOCKETEVENTS.GAME_ENDED, this);
};


module.exports = Session;