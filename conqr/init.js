
//
//var WorldMap = require("./map");
//
//var map = new WorldMap();
//console.log(map.toString());
//
//var fld = map.get(5, 5);
//console.log("Got field:", fld);
//
//var inrange = map.inRangeOf(fld, 1);
//console.log("neighbours are:", inrange.length, "->\n", inrange);

var GameHandler = require("./gamehandler");


var gh = new GameHandler();

console.log("Starting Game");
console.log(gh.game.map.toString());
console.log("************************************************************");
//var p1 = gh.game.getPlayer("player 1");
//var p2 = gh.game.getPlayer("player 2");

gh.handleCommand("player 1", "build", "{\"x\": 0, \"y\": 0}");

console.log(gh.game.map.toString());

gh.handleCommand("player 1", "build", "{\"x\": 0, \"y\": 0}");

console.log(gh.game.map.toString());