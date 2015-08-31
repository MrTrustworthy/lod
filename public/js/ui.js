var EventHandler = require("./mt-event");
var SOCKETEVENTS = require("../socketevents");

var UI = function () {

    EventHandler.makeEvented(this);


    document.getElementById("queue_container").style.visibility = "hidden";

    this.uiTable = document.getElementById("ui_container");
    this.uiTable.style.visibility = "visible";
    this.tableFields = {
        name: document.getElementById("ui_table_name"),
        build: document.getElementById("ui_table_build"),
        def: document.getElementById("ui_table_def"),
        off: document.getElementById("ui_table_off"),
        turn: document.getElementById("ui_table_turn"),
        endTurn: document.getElementById("ui_table_end_turn")
    };

    this.tableFields.name.innerHTML = window.user.name;

    // create end turn button
    var btn = document.createElement("button");
    btn.innerHTML = "End Turn";
    btn.onclick = function () {
        this.emit(SOCKETEVENTS.CLIENT.END_TURN, {});
    }.bind(this);


    this.tableFields.endTurn.appendChild(btn);

};

UI.prototype.update = function (viewData) {

    var playerData = viewData.players.filter(function (player) {
        return player.name === window.user.name;
    })[0];

    this.tableFields.build.innerHTML = playerData.ressources.Build;
    this.tableFields.def.innerHTML = playerData.ressources.Def;
    this.tableFields.off.innerHTML = playerData.ressources.Off;
    this.tableFields.turn.innerHTML = viewData.turnOf;

};


module.exports = UI;