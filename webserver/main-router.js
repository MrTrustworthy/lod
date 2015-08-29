var logger = require("../utils/mt-log")("main-log");
var express = require('express');
var router = express.Router();

var CONST = require("../utils/constants");
var PATH = CONST.PATH;
var LOGIN_NAME = CONST.SESSION.LOGIN_NAME;


var checkAuth = require("./webserverutil").checkAuth;


/* GET home page. */
router.get(PATH.BASE, checkAuth, function(request, response) {
    return response.render("main", {
        title: "Welcome",
        message: "Welcome to the first webpage!",
        user_login: request.session[LOGIN_NAME]
    });
});

module.exports.router = router;
