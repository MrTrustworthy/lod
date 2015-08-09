/**
 * Created by MrTrustworthy on 02.08.2015.
 */
var MTEvent = require("./mt-event");

var INPUT_CONFIG = new Map();
INPUT_CONFIG.set();


var InputHandler = function () {
    MTEvent.makeEvented(this);
    this.currentBuffer = this._getClearBuffer();
    this._startHandlers();
    this.isBufferDirty = false;


};

InputHandler.prototype._startHandlers = function(domElement){
    domElement = domElement || document;
    domElement.onmousedown = this._mouseClickHandlerFunc.bind(this);
    domElement.onmousemove = this._mouseMoveHandlerFunc.bind(this);
    domElement.onkeydown = this._keyHandlerFunc.bind(this);

};

InputHandler.prototype._getClearBuffer = function () {
    this.isBufferDirty = false;
    return {
        mouse: {
            clicked: false,
            posX: undefined,
            posY: undefined
        },
        keys: []
    };
};

InputHandler.prototype.getInputBuffer = function () {
    if(!this.isBufferDirty) return null;

    var c = JSON.parse(JSON.stringify(this.currentBuffer));
    this.currentBuffer = this._getClearBuffer();
    return c;
};

InputHandler.prototype._mouseClickHandlerFunc = function (evt) {
    this.emit("inputChanged", this);
    this.isBufferDirty = true;
    this.currentBuffer.mouse.clicked = true;
};

InputHandler.prototype._mouseMoveHandlerFunc = function (evt) {
    //this.isBufferDirty = true;
    this.currentBuffer.mouse.posX = evt.x;
    this.currentBuffer.mouse.posY = evt.y;
};


InputHandler.prototype._keyHandlerFunc = function (evt) {
    this.emit("inputChanged", this);
    this.isBufferDirty = true;
    if(this.currentBuffer.keys.indexOf(evt.keyCode) === -1) this.currentBuffer.keys.push(evt.keyCode);
};

module.exports = InputHandler;