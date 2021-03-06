var Ressource = function (name, amount) {

    this.name = name;
    this.amount = amount || 0;

};

Ressource.TYPES = {
    BUILD: "build",
    SHIELD: "shield",
    ATTACK: "attack"
};

Object.defineProperty(Ressource.TYPES, "RANDOM", {
    set: function(val){
        console.error("#Ressource: Can't set random to", val);
    },
    get: function(){
        var rand = Math.random();
        if(rand < 0.3) return "attack";
        if(rand < 0.6) return "shield";
        else return "build";
    }
});

Ressource.prototype.canSub = function(amount){
    return this.amount >= amount;
};


/**
 * Subtracts a given amount of ressources from this ressource
 * and returns a new ressource object with the specified amount if possible
 * @param amount
 */
Ressource.prototype.sub = function(amount){
    amount = amount || 1;
    var fetchAmount = Math.min(amount, this.amount);
    this.amount -= fetchAmount;
    return new Ressource(this.name, fetchAmount);
};

/**
 *
 * @param other
 */
Ressource.prototype.add = function(other){
    if(this.name !== other.name) throw new TypeError("Ressource type", other.name, "cant be added to", this.name);
    this.amount += other.amount;
};

Ressource.prototype.toJSON = function () {
    return {name: this.name, amount: this.amount};
};

Ressource.prototype.toString = function () {
    return this.name + ":" + this.amount;
};



module.exports = Ressource;