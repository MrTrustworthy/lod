/**
 * Created by MrTrustworthy on 02.08.2015.
 */
var MTEvent = require("../shared/js/mt-event");

var Activity = function () {
    MTEvent.makeEvented(this);

    this.participants = [];

    this.inputBuffer = [];

    this.world = {
        level: {
            sizeX: 250,
            sizeY: 250
        },
        actors: []
    };

    this.isDirty = false;
};

Activity.prototype.addParticipant = function (participant) {
    this.participants.push(participant);

    var randInt = function (from, to) {
        return Math.floor(Math.random() * (to + 1 - from) + from);
    };

    var actor = {
        name: participant.name,
        posX: randInt(0, this.world.level.sizeX/4),
        posY: randInt(0, this.world.level.sizeY/4)
    };

    this.world.actors.push(actor);
};

Activity.prototype.start = function(){


};

Activity.prototype.processTick = function(){

    this.inputBuffer.forEach(function(input){
        this.world.actors.forEach(function(actor){

            if(actor.name !== input.name) return;
            actor.posX += input.input.x || 1;
            actor.posY += input.input.y || 1;

        });
    }.bind(this));

    //clear input buffer
    this.inputBuffer = [];

};

Activity.prototype.getInitView = function () {
    return this.world;
};

Activity.prototype.getUpdateView = function () {
    if(this.isDirty){
        this.isDirty = false;
        return this.world;
    } else{
        return null;
    }

};


/**
 * This puts the new input in a buffer to process on the next tick
 * @param client
 * @param input
 */
Activity.prototype.setUpdatedInput = function (client, input) {
    //console.log("#Activity got updated input!");
    this.inputBuffer.push({
        name: client.name,
        input: input
    });

    this.isDirty = true;
};

module.exports = Activity;