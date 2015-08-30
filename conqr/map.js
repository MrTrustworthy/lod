var Field = require("./field");

var WorldMap = function (size) {

    this.size = size || {x: 10, y: 10};

    this.fields = this.initMap();
    this.forEach(function (nullVal, x, y) {
        this.fields[x][y] = new Field({x: x, y: y});
    }.bind(this));

};


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

WorldMap.prototype.inRangeOf = function (originField, range) {
    range = range || 1;

    var center = originField.position;

    return this.filter(function (field) {
        var diff = Math.abs(center.x - field.position.x) + Math.abs(center.y - field.position.y);
        return diff <= range && diff !== 0;
    });
};

WorldMap.prototype.getStartingPoints = function (amount) {
    amount = amount || 2;

    var coords = [];

    coords.push({
        x: Math.floor(this.size.x / 2),
        y: Math.floor(this.size.y / 4)
    });

    if (amount === 1) {
        return coords;
    }

    coords.push({
        x: Math.floor(this.size.x / 2),
        y: Math.floor(this.size.y / 1.5)
    });
    return coords;
};


/*##############################################################*/


WorldMap.prototype.get = function (x, y) {
    return this.fields[x][y];
};

WorldMap.prototype.forEach = function (callback) {
    var x, y, row;
    for (x = 0; x < this.fields.length; x++) {
        row = this.fields[x];
        for (y = 0; y < row.length; y++) {
            callback(row[y], x, y);
        }
    }
};

WorldMap.prototype.filter = function (callback) {
    var flds = [];
    this.forEach(function (field) {
        if (callback(field)) {
            flds.push(field);
        }
    });
    return flds;
};

WorldMap.prototype.toJSON = function () {
    var json = [];
    this.forEach(function (fld) {
        json.push(fld.toJSON());
    });
    return json;
};


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