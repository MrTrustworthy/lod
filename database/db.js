var DBCONST = require("../utils/constants").DB;
var Deferred = require("../shared/js/mt-promise");
var sqlite3 = require('sqlite3').verbose();
var fs = require("fs");


fs.exists(DBCONST.NAME, function(exists){
    var db = new sqlite3.Database(DBCONST.NAME);
    if(exists){
        console.log("DB already existing, skipping new creation");
        db.each("SELECT rowid, name, password, creation_date FROM users", function(err, row) {
            console.log(row.rowid, ":", row.name, ": ", row.password, ":", row.creation_date);
        });
        return;
    }
    db.serialize(function() {
      db.run("CREATE TABLE users (name TEXT UNIQUE NOT NULL, password TEXT NOT NULL, creation_date INTEGER)");
      var statement = db.prepare("INSERT INTO users VALUES (?, ?, ?)");
      statement.run("ad", "min", Date.now());
      statement.finalize();
    });
    db.close();
});

var openDB = (function(){
    var deferred = new Deferred();
    var db = new sqlite3.Database(
        DBCONST.NAME,
        sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
        function(errorObj){
            if(!errorObj){
                // !IMPORTANT! put DB in serialization mode
                db.serialize();
                deferred.resolve(db);
            } else {
                console.log("couldn't open DATABASE!! ERROR:", errorObj);
                deferred.reject(errorObj);
            }
        }
    );
    return deferred.promise;
})();



module.exports.createUser = function(name, password){
    var deferred = new Deferred();
    openDB.then(function(db){
        db.run(
            "INSERT INTO users VALUES (?, ?, ?)",
            [name, password, Date.now()],
            function(err){
                // "run" will call this with an error object if there is one
                if(err) deferred.reject(err);
                else deferred.resolve();
            }
        );
    }, function(error){
        // if there is a database-error
        deferred.reject(error);
    });
    return deferred.promise;
};

module.exports.checkLogin = function(name, password){
    var deferred = new Deferred();
    openDB.then(function(db){
        //console.log("trying to confirm login:", name, password);
        // asking for a user with the given name & password
        // if there is one, we can assume login is correct
        db.get(
            "SELECT name FROM users WHERE name=? AND password=?",
            [name, password],
            function(err, row){
                // interpret the result and respond accordingly
                //console.log("got row", row);
                if(err || !row) deferred.reject([err, row]);
                else deferred.resolve();
            }
        );
    }, function(error){
        // if there is a database-error
        deferred.reject(error);
    });
    return deferred.promise;
};
