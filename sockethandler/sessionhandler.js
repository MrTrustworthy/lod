var logger = require("../utils/mt-log")("main-log");
var SOCKETEVENTS = require("../shared/socketevents");
var Matchmaker = require("./matchmaker");
var Session = require("./session");


/**
 * The sessionhandler is responsible for managing the different game-sessions that get started.
 * It watches the matchmaker instance for matches and starts a gamesession for each match.
 * @constructor
 */
var SessionHandler = function() {
    this.matchmaker = null;
    this.sessions = [];
};

/**
 * Listens to a given matchmaker for the "match_found" event and handles it
 * @param matchmaker
 */
SessionHandler.prototype.watch = function(matchmaker){
    if(!(matchmaker instanceof Matchmaker)) throw TypeError("This is not a Matchmaker!");
    this.matchmaker = matchmaker;
    this.matchmaker.startChecking();
    this.matchmaker.on(SOCKETEVENTS.MATCHMAKING.MATCH_FOUND, this.handleMatch.bind(this));
};

/**
 * Gets called by this.watch when a match is found and handles it
 * @param matchData
 */
SessionHandler.prototype.handleMatch = function(clients){

    logger.log("#SessionHandler recieved a match with", clients.length, "clients");

    var session = new Session(clients);
    this.sessions.push(session);

    //session.addClients();
    //session.start();

};



module.exports = SessionHandler;
