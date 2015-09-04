var THREE = require("./libs/three");
var Evented = require("./mt-event");
var VISUTIL = require("./visutil");

/**
 *
 * @constructor
 */
var Visuals = function () {


    this.canvas = document.getElementById("main_canvas");

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, this.canvas.width / this.canvas.height, 0.1, 1000);

    this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        precision: "highp",
        antialias: true
    });
    this.renderer.setSize(this.canvas.width, this.canvas.height);


    Evented.makeEvented(this);
    this.loadClickHandler();

};

/**
 *
 */
Visuals.prototype.loadClickHandler = function () {

    this.canvas.addEventListener('mousedown', VISUTIL.canvasMouseDownHandler.bind(this), false);
    this.canvas.addEventListener("contextmenu", VISUTIL.canvasRightClickHandler.bind(this), false);
};


/**
 *
 * @param viewData
 */
Visuals.prototype.initView = function (viewData) {
    var scene = this.scene;

    console.log("#Visualmanager: initializing view with data", viewData);

    // Step 1: Set up camera position and view
    this.camera.position.x = 50;
    this.camera.position.y = 50;
    this.camera.position.z = 75;
    this.camera.lookAt(new THREE.Vector3(50, 50, 0));


    // Step 2: Set up fields
    viewData.map.forEach(function (field) {
        var plane, object;
        plane = VISUTIL.createPlaneForField(field);
        if (field.object) {
            object = VISUTIL.createObjectForField(field.object);
            plane.add(object);
        }
        scene.add(plane);
    });

};

/**
 *
 * @param viewData
 */
Visuals.prototype.updateView = function (viewData) {

    var currentFields, updatedFields;
    console.log("#Visualmanager updating views with", viewData);

    currentFields = this.scene.children;
    updatedFields = viewData.map;

    // we can assume that the viewdata and the scenes children are in the same order
    currentFields.forEach(function (currentField, i) {

        this.updateField(currentField, updatedFields[i]);
    }.bind(this));


};

Visuals.prototype.updateField = function (currentField, newFieldData) {

    // DEBUG check for errors with this approach
    if (currentField.userData.position.x !== newFieldData.position.x &&
        currentField.userData.position.y !== newFieldData.position.y) {
        throw new Error("Field update order doesn't match!");
    }
    if (!VISUTIL.hasChanged(currentField.userData, newFieldData)) {
        console.log("Nothing changed!");
        return;
    }

    // Update object on field & data of the field
    this.updateObject(currentField, newFieldData);
    currentField.userData = newFieldData;

    //TODO update field data like ressources


};

Visuals.prototype.updateObject = function (currentField, newFieldData) {
    if (!VISUTIL.hasChanged(currentField.userData.object, newFieldData.object)) {
        console.log("Object has not changed!");
        return;
    }

    // remove current object if exists
    if (currentField.children.length === 1) {
        currentField.remove(currentField.children[0]);
    }

    var newObject = VISUTIL.createObjectForField(newFieldData.object);
    currentField.add(newObject);

};

/**
 * Starts the rendering of the scene
 */
Visuals.prototype.startRenderLoop = function () {

    var renderFunc = function () {
        window.requestAnimationFrame(renderFunc);
        this.renderer.render(this.scene, this.camera);

    }.bind(this);
    renderFunc();

};

module.exports = Visuals;