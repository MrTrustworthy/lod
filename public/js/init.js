console.log("Starting INIT");
var User = require("./user");
var CONST = require("../socketevents");

var user = new User();
user.setName(document.getElementById("login_name_container").innerHTML);
user.loadSocket(window.location.href + CONST.SOCKET_PATH_NOSLASH);
user.setupListeners();
window.user = user;
