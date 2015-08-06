var LOGIN_NAME = require("../utils/constants").SESSION.LOGIN_NAME;

/**
 * This function can be put before a routing function and will check whether the session
 * has an active login. If not, the user will be redirected to /login
 */
module.exports.checkAuth = function (request, response, next){
    var loginName = request.session[LOGIN_NAME];
    console.log("checking for session auth:", loginName);
    if(loginName) return next();
    else return response.redirect("/login");
};
