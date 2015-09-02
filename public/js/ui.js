var EventHandler = require("./mt-event");
var SOCKETEVENTS = require("../socketevents");

var UI = function () {

    EventHandler.makeEvented(this);


    document.getElementById("queue_container").style.visibility = "hidden";

    this.infoPane = {};
    this.actionPane = {};


    this._loadInfoPane();
    this._loadActionPane();

};

/**
 * Initializes the info-pane on the top
 * @private
 */
UI.prototype._loadInfoPane = function () {


    this.infoPane.container = document.getElementById("ui_container");
    this.infoPane.container.style.visibility = "visible";

    this.infoPane.name = document.getElementById("ui_table_name");
    this.infoPane.build = document.getElementById("ui_table_build");
    this.infoPane.def = document.getElementById("ui_table_def");
    this.infoPane.off = document.getElementById("ui_table_off");
    this.infoPane.turn = document.getElementById("ui_table_turn");
    this.infoPane.endTurn = document.getElementById("ui_table_end_turn");

    // set name
    this.infoPane.name.innerHTML = window.user.name;

    // create end turn button
    var btn = document.createElement("button");
    btn.innerHTML = "End Turn";
    btn.onclick = function () {
        this.emit(SOCKETEVENTS.CLIENT.CLICKED_END_TURN, {});
    }.bind(this);
    this.infoPane.endTurn.appendChild(btn);
};

UI.prototype._loadActionPane = function () {

    var actionFunc = function (infoObj) {
        this.emit(SOCKETEVENTS.CLIENT.CLICKED_ON_ACTION, infoObj);
    }.bind(this);

    actionFunc({a: "b"});


};

/**
 * TODO
 * @param selection
 */
UI.prototype.updateActionPane = function (selection) {
    console.log("#UI: Updating selection TODO");
};


/**
 *
 * @param viewData
 */
UI.prototype.updatePlayerData = function (viewData) {

    var playerData = viewData.players.filter(function (player) {
        return player.name === window.user.name;
    })[0];

    if (!playerData) {
        console.error("#UI: Couldn't update the info pane because player data is missing!", viewData);
        return;
    }

    this.infoPane.build.innerHTML = playerData.ressources.Build;
    this.infoPane.def.innerHTML = playerData.ressources.Def;
    this.infoPane.off.innerHTML = playerData.ressources.Off;
    this.infoPane.turn.innerHTML = viewData.turnOf;

};


module.exports = UI;