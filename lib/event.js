'use strict';

var ev = require('events');
var util = require('util');

function theEmitter() {
	ev.call(this);
}
util.inherits(theEmitter, ev);

module.exports = theEmitter;
