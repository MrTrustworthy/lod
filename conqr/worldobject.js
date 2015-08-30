var defaultConfig = {
    owner: "Neutral",
    values: {
        Off: 1,
        Def: 1
    }
};


var WorldObject = function (owner, attack, shield) {

    this.owner = owner;
    this.attack = attack || 0;
    this.shield = shield || 0;
};

WorldObject.prototype.toString = function () {
    return "<" + this.owner.name + "(" + this.attack + ":" + this.shield + ")>";
};

WorldObject.prototype.toJSON = function () {
    return {
        owner: this.owner,
        values: this.values
    };
};

module.exports = WorldObject;