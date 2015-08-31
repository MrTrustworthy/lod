var THREE = require("./libs/three");
var Evented = require("./mt-event");
var SOCKETEVENTS = require("../socketevents");

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

    var canvasMouseDown = function (event) {

        var ray, intersections, coords, canvasX, canvasY;

        event.preventDefault();

        // need to adjust the X/Y coords of the click to account for canvas position/offset
        canvasX = event.clientX - event.target.offsetLeft;
        canvasY = event.clientY - event.target.offsetTop;

        coords = new THREE.Vector2();
        coords.x = (canvasX / this.renderer.domElement.width) * 2 - 1;
        coords.y = -(canvasY / this.renderer.domElement.height) * 2 + 1;

        ray = new THREE.Raycaster();
        ray.setFromCamera(coords, this.camera);

        intersections = ray.intersectObjects(this.scene.children);

        if (intersections.length === 0) {
            return;
        }

        this.emit(SOCKETEVENTS.CLIENT.CLICKED_ON_OBJECT, intersections);

    };

    this.canvas.addEventListener('mousedown', canvasMouseDown.bind(this), false);
};


/**
 *
 * @param viewData
 */
Visuals.prototype.initView = function (viewData) {

    var resColors, createObject, stringToColor;

    console.log("#Visualmanager: trying to initialize view with data", viewData);

    // Step 0: Prepare utilities for view
    resColors = {
        default: 0x444444,
        Off: 0xff0000,
        Def: 0x0000ff,
        Build: 0x00ff00
    };

    stringToColor = function (str) { // java String#stringToColor
        var hash, i, c;

        hash = 0;
        for (i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        c = (hash & 0x00FFFFFF)
            .toString(16)
            .toUpperCase();
        return "00000".substring(0, 6 - c.length) + c;
    };


    // Step 1: Set up camera position and view
    this.camera.position.x = 50;
    this.camera.position.y = 50;
    this.camera.position.z = 75;
    this.camera.lookAt(new THREE.Vector3(50, 50, 0));


    // Step 2: Prepare creation of worldobjects
    createObject = function (field) {

        var object, geometry, material, sphere;

        object = field.object;
        if (!object) {
            return;
        }


        geometry = new THREE.SphereGeometry(2);
        material = new THREE.MeshBasicMaterial({
            color: stringToColor(object.owner.name)
        });
        sphere = new THREE.Mesh(geometry, material);

        //sphere.position.x = field.position.x * 5;
        //sphere.position.y = field.position.y * 5;
        //sphere.position.z = 5;
        sphere.userData = field;

        return sphere;


    };


    // Step 2: Set up fields
    viewData.map.forEach(function (field) {
        var geometry, material, plane, color, object;

        color = !field.ressource ? resColors.default : resColors[field.ressource.name];

        geometry = new THREE.PlaneGeometry(5, 5);

        material = new THREE.MeshBasicMaterial({color: color, side: THREE.DoubleSide});
        plane = new THREE.Mesh(geometry, material);

        plane.position.x = field.position.x * 5;
        plane.position.y = field.position.y * 5;
        plane.position.z = 0;
        plane.userData = field;

        object = createObject(field);
        if (object) {
            plane.add(object);
        }

        this.scene.add(plane);

    }.bind(this));


    // Step 3: Set up buildings


};

/**
 *
 * @param viewData
 */
Visuals.prototype.updateView = function (viewData) {
    console.log("#Visualmanager updating views with", viewData);
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