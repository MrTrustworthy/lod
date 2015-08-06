console.log("Starting INIT");
var User = require("/js/user.js");


var user = new User();
user.setName(document.getElementById("login_name_container").innerHTML);
user.loadSocket("http://localhost:3000/game");
user.setupListeners();
window.user = user;
