module.exports = {

    objectSplice: function objectSplice(object, start, delCount){
        var resultObj = {};
        var keys = Object.keys(object).splice(start, delCount);
        keys.forEach(function(key){
            resultObj[key] = object[key];
            delete object[key];
        });
        return resultObj;
    },

    clearObject: function clearObject(object){
        Object.keys(object).forEach(function(key){
           delete object[key]
        });
        return object;
    },

    removeFromArray: function removeFromArray(array, object){
        var i = array.indexOf(object);
        if(i === -1) {
            console.log("debug info:", object, "---",array);
            throw Error("Can't remove object that's not there!");
        }
        array.splice(i, 1);
        return array;
    },

    arrayComp: function arrayComp(array, selector){
        var _values = [];
        array.forEach(function(client){
            var value = selector(client)
            if (value) _values.push(value);
        });
        return _values;
    },

    checkForValue: function checkForValue(obj, searchedValue, currPath){

        currPath = currPath || "object";

        Object.keys(obj).forEach(function(key, i){

            var objVal = obj[key];
            var extendedPath = currPath;

            // if obj is an array:
            if(key == i){
                extendedPath += ("[" + key + "]");
            } else{
                extendedPath += ("." + key);
            }


            if(searchedValue === key) console.log("FOUND IT AS KEY", extendedPath);
            else if (searchedValue === objVal) console.log("FOUND IT AS VALUE:", extendedPath);
            else if (objVal instanceof Object) {
                try{
                    checkForValue(objVal, searchedValue, extendedPath);
                }catch (e){
                    if(!(e instanceof RangeError)) console.log("Found error:", e);
                }
            }


        });
        console.log("found nothing");

    },


    forEachObject: function(object, callback){
        Object.keys(object).forEach(function(key){
            callback(key, object[key]);
        });
    }
};

// tests:
(function testObjectSplice(){
    var testObj = {
        "a": 1,
        "b": 2,
        "c": 3
    };

    var to = module.exports.objectSplice(testObj, 0, 2);
    if(to.a === 1 && to.b === 2 && to.c === undefined && testObj.a === undefined && testObj.b === undefined){
        console.log("ObjectSplice works");
    } else {
        console.error("ObjectSplice fails!");
    }
})();

// tests:
(function testClearObject(){
    var to = {
        "a": 1,
        "b": 2,
        "c": 3
    };

    module.exports.clearObject(to);

    if(!to.a && !to.b && !to.c){
        console.log("ClearObject works");
    } else {
        console.error("ClearObject fails!");
    }
})();

(function testRemoveFromArray(){
    var a = {a: 1};
    var b = {b: 2};
    var c = {c: 3};

    var arr = [a, b, c];

    module.exports.removeFromArray(arr, b);
    var err = false;
    arr.forEach(function(el){
        if(!!el.b){
            console.error("RemoveFromArray Failed!");
            err = true;
        }

    });
    if(!err) console.log("RemoveFromArray works!");

})();

(function testArrayComp(){
    var a = {a: 1};
    var b = {a: 2};
    var c = {a: 3};

    var arr = [a, b, c];

    var selectorFunc = function(element){
        return element.a !== 2 ? element.a : null;
    };

    var res = module.exports.arrayComp(arr, selectorFunc);
    if(res.length === 2 && res[0] === 1 && res[1] === 3){
        console.log("TestArrayComp works!");
    }else{
        console.log("TestArrayComp failed!", res);
    }

})();