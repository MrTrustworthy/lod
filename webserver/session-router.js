var logger = require("../utils/mt-log")("main-log");
var express = require('express');
var router = express.Router();

var CONST = require("../utils/constants");
var PATH = CONST.PATH;

var db = require("../database/db");

/**
 * GET Route for /LOGIN
 * @method get
 * @param  {String} PATH.LOGIN        see constants.js
 * @param  {handle function} function(request, response      handles request
 * @return {None}                   just used to abort further function calls
 */
router.get(PATH.LOGIN, function(request, response) {
    var infoMessage = "Please log in!";
    if(request.query.error === "empty") infoMessage = "Please enter Name and Password!";
    if(request.query.error === "failed") infoMessage = "Login information wrong, please try again!";

    return response.render("login", {
        title: "Login",
        info_message: infoMessage
    });
});

/**
 * POST Route for /POST
 * @method get
 * @param  {String} PATH.LOGIN        see constants.js
 * @param  {handle function} function(request, response      handles request
 * @return {None}                   just used to abort further function calls
 */
router.post(PATH.LOGIN, function(request, response) {
    var name = request.body.login_name;
    var password = request.body.login_password;
    logger.log("#Session-router: trying to login user", name, password);

    // check for form entries
    if(!name || !password) return response.redirect("/login?error=empty");

    // check DB for login
    db.checkLogin(name, password).then(function(){
        //login was correct
        // set session
        request.session[CONST.SESSION.LOGIN_NAME] = name;
        // redirect to main
        return response.redirect("/");
    }, function(err){
        // login was incorrect
        logger.log("#Session-router: Login failed:", err);
        return response.redirect("/login?error=failed");
    });


});

/**
 * GET Route for /LOGOUT
 * @method get
 * @param  {String} PATH.LOGOUT        see constants.js
 * @param  {handle function} function(request, response      handles request
 * @return {None}                   just used to abort further function calls
 */
router.get(PATH.LOGOUT, function(request, response){
    logger.log("#Session-router: logging out", request.session[CONST.SESSION.LOGIN_NAME]);
    // remove session flag
    delete request.session;
    response.redirect("/login");
});


/**
 * GET Route for /REGISTER
 * @method get
 * @param  {String} PATH.REGISTER        see constants.js
 * @param  {handle function} function(request, response      handles request
 * @return {None}                   just used to abort further function calls
 */
router.get(PATH.REGISTER, function(request, response) {
    var infoMessage = "Please register!";
    if(request.query.error === "empty") infoMessage = "Please enter Name and Password to register!";
    if(request.query.error === "failed") infoMessage = "Registering failed!";
    return response.render("register", {
        title: "Register",
        info_message: infoMessage
    });
});

/**
 * POST Route for /REGISTER
 * @method get
 * @param  {String} PATH.REGISTER        see constants.js
 * @param  {handle function} function(request, response      handles request
 * @return {None}                   just used to abort further function calls
 */
router.post(PATH.REGISTER, function(request, response) {
    var name = request.body.register_name;
    var password = request.body.register_password;
    logger.log("#Session-router: trying to register new user with", name, password);

    if(!name || !password) return response.redirect("/register?error=empty");

    // create new DB entry
    db.createUser(name, password).then(function(){
        // everything went well
        // redirect to main
        return response.redirect("/login");
    }, function(err){
        // registering failed
        logger.error("#Session-router: Registering failed:", err);
        return response.redirect("/register?error=failed");
    });


});

module.exports.router = router;
