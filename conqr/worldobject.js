
var WorldObject = function (type) {

    this.name = type.name;
    this.attack = type.attack;
    this.shield = type.shield;

    // gets set by the player object
    this.owner = null;

    // gets set by the field object
    this.field = null;
};

WorldObject.TYPES = {
    BASE: {
        name: "Base",
        attack: 1,
        shield: 3
    },
    STREET: {
        name: "street",
        attack: 0,
        shield: 1
    },
    BUILDING: {
        name: "building",
        attack: 1,
        shield: 1
    }
};

WorldObject.prototype.hit = function(damage){
    this.shield -= damage;
    if(this.shield < 0) this.destroy();
};


WorldObject.prototype.destroy = function(){
    this.field.removeObject();
    this.owner.removeObject(this);
};

WorldObject.prototype.toString = function () {
    return "<" + this.owner.name + "(" + this.attack + ":" + this.shield + ")>";
};

WorldObject.prototype.toJSON = function () {
    return {
        owner: this.owner,
        attack: this.attack,
        shield: this.shield
    };
};

module.exports = WorldObject;