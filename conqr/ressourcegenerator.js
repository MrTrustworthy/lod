var Ressource = function (name, amount) {

    this.name = name;
    this.amount = amount || 0;

};

Ressource.prototype.toJSON = function () {
    return {name: this.name, amount: this.amount};
};

Ressource.prototype.toString = function () {
    return this.name + ":" + this.amount;
};


var RessourceGenerator = function () {
    this.RES = {
        BUILD: "Build",
        OFF: "Off",
        DEF: "Def"
    };
};

RessourceGenerator.prototype.randomType = function () {
    return this.RES[Object.keys(this.RES)[Math.floor(Math.random() * Object.keys(this.RES).length)]];
};

RessourceGenerator.prototype.get = function (type, amount) {
    type = type || this.randomType();
    amount = (amount === undefined) ? Math.ceil(Math.random() * 4) : amount;
    return new Ressource(type, amount);
};

RessourceGenerator.prototype.getStartingRessources = function () {
    return {
        "Build": 3,
        "Off": 3,
        "Def": 3
    };
};


module.exports = new RessourceGenerator();