var RG = require("./ressourcegenerator");

var Field = function (position) {

    this.position = position;

    this.ressource = Math.random() > 0.3 ? RG.get() : null;

    this.object = null;

};

Field.prototype.placeObject = function (obj) {
    if (this.object) {
        throw new Error("Already have object on", this);
    }
    this.object = obj;
};

Field.prototype.removeObject = function () {
    this.object = null;
};


Field.prototype.toString = function () {
    var obj = this.object ? this.object.toString() : "None";
    //console.log("OBJ::", obj);
    return "[(" + this.position.x + ":" + this.position.y + ")" + this.ressource + "/" + obj + "]";
};

Field.prototype.toJSON = function () {
    return {
        position: this.position,
        object: this.object ? this.object.toJSON() : null,
        ressource: this.ressource ? this.ressource.toJSON() : null
    };
};

module.exports = Field;

