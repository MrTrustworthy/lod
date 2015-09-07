var Field = require("./field");
var CommandError = require("../utils/commanderror");

/**
 *
 * @param size
 * @constructor
 */
var WorldMap = function (size) {

    this.size = size || {x: 10, y: 10};

    this.fields = this.initMap();
    this.forEach(function (nullVal, x, y) {
        this.fields[x][y] = new Field({x: x, y: y});
    }.bind(this));

};


/**
 *
 * @returns {Array}
 */
WorldMap.prototype.initMap = function () {
    var x,
        y,
        map = [];

    for (x = 0; x < this.size.x; x++) {
        map[x] = [];
        for (y = 0; y < this.size.y; y++) {
            map[x][y] = null;
        }
    }
    return map;
};

/**
 *
 * @param originField
 * @param range
 * @returns {*|Array.<T>}
 */
WorldMap.prototype.inRangeOf = function (originField, range) {
    range = range || 1;

    var center = originField.position;

    return this.filter(function (field) {
        var diff = Math.abs(center.x - field.position.x) + Math.abs(center.y - field.position.y);
        return diff <= range && diff !== 0;
    });
};

/**
 *
 * @param field1
 * @param field2
 * @returns {boolean}
 */
WorldMap.prototype.areAdjacent = function(field1, field2){
    var isAdjacent = this.adjacentTo(field1).filter(function(field){
        return field.equals(field2);
    });
    return isAdjacent.length === 1;
};


/**
 *
 * @param originField
 * @returns {*|Array.<T>}
 */
WorldMap.prototype.adjacentTo = function(originField){
    var center = originField.position;

    return this.filter(function (field) {
        if (field.equals(originField)) return false;
        return Math.abs(center.x - field.position.x) <= 1 && Math.abs(center.y - field.position.y) <= 1;
    });

};

/**
 *
 * @param amount
 * @returns {Array}
 */
WorldMap.prototype.getStartingPoints = function (amount) {
    amount = amount || 2;

    var coords = [];

    coords.push({
        x: 5,
        y: 5
        //x: Math.floor(this.size.x / 2),
        //y: Math.floor(this.size.y / 4)
    });

    if (amount === 1) {
        return coords;
    }

    coords.push({
        x: 5,
        y: 7
        //x: Math.floor(this.size.x / 2),
        //y: Math.floor(this.size.y / 1.5)
    });
    return coords;
};


/*##############################################################*/


/**
 *
 * @param x
 * @param y
 * @returns {*}
 */
WorldMap.prototype.get = function (x, y) {
    try {
        var fld = this.fields[x][y];
        if (!fld) throw new CommandError("A field on", x, ":", y, "doesn't exist");
        else return fld;
    }catch(e){
        if(e instanceof CommandError) throw e;
        else throw new CommandError("A field on", x, ":", y, "doesn't exist");
    }

};

/**
 *
 * @param callback
 */
WorldMap.prototype.forEach = function (callback) {
    var x, y, row;
    for (x = 0; x < this.fields.length; x++) {
        row = this.fields[x];
        for (y = 0; y < row.length; y++) {
            callback(row[y], x, y);
        }
    }
};

/**
 *
 * @param callback
 * @returns {Array}
 */
WorldMap.prototype.filter = function (callback) {
    var flds = [];
    this.forEach(function (field) {
        if (callback(field)) {
            flds.push(field);
        }
    });
    return flds;
};

/**
 *
 * @returns {Array}
 */
WorldMap.prototype.toJSON = function () {
    var json = [];
    this.forEach(function (fld) {
        json.push(fld.toJSON());
    });
    return json;
};


/**
 *
 * @returns {Array}
 */
WorldMap.prototype.toString = function () {
    var output = [],
        currRow = 0;

    this.forEach(function (field) {
        if (field.position.x > currRow) {
            output.push("\n");
            currRow = field.position.x;
        }
        output.push(field.toString());
    });

    output = output.join("");
    return output;
};


module.exports = WorldMap;