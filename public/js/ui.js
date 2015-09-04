var EventHandler = require("./mt-event");
var SOCKETEVENTS = require("../socketevents");

var UI = function () {

    EventHandler.makeEvented(this);


    document.getElementById("queue_container").style.visibility = "hidden";

    //this.selected = null; can use data from inputhandler???

    this.playerName = window.user.name;

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
    this.infoPane.endTurnBtn = document.getElementById("ui_table_end_turn_button");

    // set name
    this.infoPane.name.innerHTML = window.user.name;
    this.infoPane.endTurnBtn.onclick = function () {
        this.emit(SOCKETEVENTS.CLIENT.CLICKED_ON_ACTION, SOCKETEVENTS.COMMAND.END_TURN);
    }.bind(this);

};


/**
 *
 * @param viewData
 */
UI.prototype.updateInfoPane = function (viewData) {
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


/**
 * TODO
 * @private
 */
UI.prototype._loadActionPane = function () {

    var getActionFunc = function (command) {
        return function () {
            this.emit(SOCKETEVENTS.CLIENT.CLICKED_ON_ACTION, command);
        }.bind(this);
    }.bind(this);


    this.actionPane.container = document.getElementById("action_pane");
    this.actionPane.selected = document.getElementById("action_pane_selected");

    this.actionPane.buildBtn = document.getElementById("action_pane_build_button");
    this.actionPane.buildBtn.show = this.show;
    this.actionPane.buildBtn.hide = this.hide;
    this.actionPane.buildBtn.onclick = getActionFunc(SOCKETEVENTS.COMMAND.BUILD);

    this.actionPane.improveBtn = document.getElementById("action_pane_improve_button");
    this.actionPane.improveBtn.show = this.show;
    this.actionPane.improveBtn.hide = this.hide;
    this.actionPane.improveBtn.onclick = getActionFunc(SOCKETEVENTS.COMMAND.IMPROVE);


    this.actionPane.attackBtn = document.getElementById("action_pane_attack_button");
    this.actionPane.attackBtn.show = this.show;
    this.actionPane.attackBtn.hide = this.hide;
    this.actionPane.attackBtn.onclick = getActionFunc(SOCKETEVENTS.COMMAND.ATTACK);

    this.actionPane.container.style.visibility = "visible";
    this.setButtonsVisible({
        build: false,
        improve: false,
        attack: false
    });

};

/**
 * conf is like:
 * {
 *      "build": true,
 *      "attack": false,
 *      "improve": true
 * }
 * @param conf
 */
UI.prototype.setButtonsVisible = function (conf) {

    var btn;
    Object.keys(conf).forEach(function (buttonName) {
        btn = this.actionPane[buttonName + "Btn"];
        if (conf[buttonName]) btn.show();
        else btn.hide();
    }.bind(this));

};

/**
 *
 * @param selection null or field or field with object
 */
UI.prototype.updateActionPane = function (selection) {

    console.log("#UI: Updating selection with:", selection);


    var selectedInfo, obj, pos, ownerName;

    if(!selection){

        selectedInfo = "Nothing";
        this.setButtonsVisible({
            build: false,
            improve: false,
            attack: false
        });

    }else if (selection.object) {

        obj = selection.object;
        ownerName = obj.owner.name;
        selectedInfo = obj.attack + ":" + obj.shield + " Node of " + ownerName;

        if (ownerName === this.playerName) {
            this.setButtonsVisible({
                build: false,
                improve: true,
                attack: false
            });
        } else {
            this.setButtonsVisible({
                build: false,
                improve: false,
                attack: true
            });
        }


        this.actionPane.buildBtn.hide();

    } else {

        pos = selection.position;
        selectedInfo = "Field on " + pos.x + ":" + pos.y;
        if (selection.ressource) {
            selectedInfo += " with " + selection.ressource.name;
        }
        this.setButtonsVisible({
            build: true,
            improve: false,
            attack: false
        });

    }
    //this.selected = selection; can use data from inputhandler???
    this.actionPane.selected.innerHTML = selectedInfo;


};


// Utility functions to manipulate the dom
UI.prototype.show = function (obj) {
    if (obj) obj.disabled = false;
    else this.disabled = false;
};

UI.prototype.hide = function (obj) {
    if (obj) obj.disabled = true;
    else this.disabled = true;
};


module.exports = UI;