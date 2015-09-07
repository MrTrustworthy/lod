var THREE = require("./libs/three");
var SOCKETEVENTS = require("../socketevents");


var Visutil = {

    hasChanged: function (currData, newData) {
        return JSON.stringify(newData) !== JSON.stringify(currData);
    },

    getFieldWithObj: function () {
        return window.user.game.visuals.scene.children.filter(function (fld) {
            return fld.userData.object;
        });
    },

    stringToColor: function (str) {
        var hash, i, c;

        hash = 0;
        for (i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        c = (hash & 0x00FFFFFF)
            .toString(16)
            .toUpperCase();
        return parseInt("00000".substring(0, 6 - c.length) + c, 16);
    },

    createObjectForField: function (object) {
        var geometry, material, sphere;

        geometry = new THREE.SphereGeometry(2);
        material = new THREE.MeshBasicMaterial({
            color: Visutil.stringToColor(object.owner.name)
        });
        sphere = new THREE.Mesh(geometry, material);

        return sphere;
    },

    createTextureForField: function (field) {
        var fieldColors, color, material;

        fieldColors = {
            default: 0x444444,
            attack: 0xff0000,
            shield: 0x0000ff,
            build: 0x00ff00
        };

        color = !field.ressource ? fieldColors.default : fieldColors[field.ressource.name];
        material = new THREE.MeshBasicMaterial({color: color, side: THREE.DoubleSide});

        return material;
    },

    createPlaneForField: function (field) {
        var geometry, material, plane;

        material = Visutil.createTextureForField(field);

        geometry = new THREE.PlaneGeometry(5, 5);


        plane = new THREE.Mesh(geometry, material);

        plane.position.x = field.position.x * 5;
        plane.position.y = field.position.y * 5;
        plane.position.z = 0;
        plane.userData = field;

        return plane;
    },

    canvasMouseDownHandler: function (event) {

        var ray, intersections, coords, canvasX, canvasY;

        event.preventDefault();

        if (event.which === 3) {
            this.emit(SOCKETEVENTS.CLIENT.CLICKED_RIGHT, null);
            return;
        }

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

    },
    canvasRightClickHandler: function (evt) {
        evt.preventDefault();
    }

};

window.visutil = Visutil;
module.exports = Visutil;
