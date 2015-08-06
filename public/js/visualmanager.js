
var THREE = require("/js/libs/three.js");

var VisualManager = function(){

    var canvas = document.getElementById("main_canvas");

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, canvas.width/canvas.height, 0.1, 1000);

    this.renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        precision: "highp",
        antialias: true
    });
    this.renderer.setSize(canvas.width, canvas.height);

    this.actorMeshes = {};
    //this.debugSetup();
};


VisualManager.prototype.initView = function(viewData){
    console.log("#Visualmanager: trying to initialize view with data", viewData);

    var levelGeometry = new THREE.BoxGeometry( viewData.level.sizeX, 1, viewData.level.sizeY );
    var levelMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    var levelMesh = new THREE.Mesh( levelGeometry, levelMaterial );

    this.scene.add( levelMesh );


    viewData.actors.forEach(function(actor){
        var actorGeometry = new THREE.BoxGeometry( 5, 10, 5 );
        var actorMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
        var actorMesh = new THREE.Mesh( actorGeometry, actorMaterial );
        actorMesh.position.x = actor.posX;
        actorMesh.position.y = 5;
        actorMesh.position.z = actor.posY;

        this.actorMeshes[actor.name] = actorMesh;
        this.scene.add(actorMesh);

    }.bind(this));

    this.camera.position.y = 190;
    this.camera.lookAt(new THREE.Vector3(0,0,0));
    //this.camera.rotation.y = -Math.PI;


    this.startRenderLoop();
};

VisualManager.prototype.updateView = function(viewData){
    console.log("#Visualmanager updating views with", viewData);
    viewData.actors.forEach(function(actor){
        var actorMesh = this.actorMeshes[actor.name];
        actorMesh.position.x = actor.posX;
        actorMesh.position.z = actor.posY;

    }.bind(this));

};

VisualManager.prototype.startRenderLoop = function(){

    var renderFunc = function(){
        requestAnimationFrame(renderFunc);
        this.renderer.render(this.scene, this.camera);

    }.bind(this);
    renderFunc();

};

module.exports = VisualManager;