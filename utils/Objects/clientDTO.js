/**
 * Created by MrTrustworthy on 01.08.2015.
 */

var ClientDTO = function (name, socket) {
    this.name = name || "default_name" + Math.random().toString();
    this.socket = socket;
};

ClientDTO.prototype.setName = function (name) {
    this.name = name;
};

ClientDTO.prototype.toString = function () {
    return "Client \'" + this.name + "\' on Socket ID: " + this.socket.id;
};

ClientDTO.prototype.equals = function (other) {
    return this.name === other.name;
};

module.exports = ClientDTO;