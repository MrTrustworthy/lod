

// Create a new object, that prototypally inherits from the Error constructor.
// Based on: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
var CommandError = function CommandError() {
    this.name = 'CommandError';
    this.message = Array.prototype.join.call(arguments, " ") || "No message provided";
    this.stack = (new Error()).stack;
};

CommandError.prototype = Object.create(Error.prototype);
CommandError.prototype.constructor = CommandError;

module.exports = CommandError;