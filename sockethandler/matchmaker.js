/**
 * Created by MrTrustworthy on 31.07.2015.
 */


/**
 * This is the reference/parent class for all matchmakers (like the queuehandler)
 *
 * @method Constructor
 * @return {[type]}             [description]
 */
var Matchmaker = function Matchmaker(){
    // setting up stuff like eventhandling
};

/**
 * Starts the checking-for-matches routine
 */
Matchmaker.prototype.startChecking = function(){
    //Calling this function will eventually trigger a "match_found" event on the matchmaker
};

/**
 * Stops the checking-for-matches routiné
 */
Matchmaker.prototype.stopChecking = function(){};


/**
 * Returns a bound handler function to submit the socket to
 *
 * @returns {function(this:Matchmaker)}
 */
Matchmaker.prototype.getHandlerFunction = function(){};


module.exports = Matchmaker;
