/**
 * Created by MrTrustworthy on 03.08.2015.
 */

var VisualManager = require("./visualmanager");
var InputHandler = require("./inputhandler");
var SOCKETEVENTS = require("../socketevents");


var Game = function(){

    this.inputHandler = new InputHandler();

    this.visualManager = new VisualManager();


};

Game.prototype.start = function(socket){


    socket.on(SOCKETEVENTS.ACTIVITY.INIT_VIEW, this.visualManager.initView.bind(this.visualManager));

    socket.on(SOCKETEVENTS.ACTIVITY.UPDATE_VIEW, this.visualManager.updateView.bind(this.visualManager));


    var updateInputFunc = function(){
        var buffer = this.inputHandler.getInputBuffer();
        if (!buffer) return;

        console.log("#Game: Sending new input to server", buffer);
        socket.emit(SOCKETEVENTS.ACTIVITY.NEW_INPUT, buffer);


    };

    this.inputHandler.on("inputChanged", updateInputFunc.bind(this));

    // TODO FIXME OMG
    //setInterval(updateInputFunc.bind(this), 100);

    //this.visualManager.evtCallb = updateInputFunc.bind(this);
    //
    //this.visualManager.scene.addEventListener("render_scene", updateInputFunc.bind(this));



    this.visualManager.startRenderLoop();

};

module.exports = Game;