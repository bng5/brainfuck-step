var util         = require('util');
var EventEmitter = require("events").EventEmitter;
var commands     = require('./commands');

function Brainfuck() {
  this._state(this.STATE_STOPPED);
  this.source = '';
  this.sourcePos = 0;
  this.delay = 100;
  this.bufferSize = 30000;
  this.reset();
}

util.inherits(Brainfuck, EventEmitter);

Brainfuck.prototype.STATE_STOPPED = 0;
Brainfuck.prototype.STATE_RUNNING = 1;
Brainfuck.prototype.STATE_PAUSED  = 2;

Brainfuck.prototype._state = function(state) {
  this.state = state;
  this.emit('statechange', state);
};

/**
 *
 */
Brainfuck.prototype.stop = function(error_str) {
  this._state(this.STATE_STOPPED);
  this.emit('end', {message: error_str}, 'output');
};

/**
 *
 */
Brainfuck.prototype.reset = function() {
  this.cursor = 0;
  this.tape = new Uint8Array(this.bufferSize);
  this.deep = new Array();
};

/**
 *
 */
Brainfuck.prototype.run = function() {
  this.reset();
  this._state(this.STATE_RUNNING);
  this.step();
};

/**
 *
 */
Brainfuck.prototype.pause = function() {
  this._state(this.STATE_PAUSED);
};

/**
 *
 */
Brainfuck.prototype.toggleRun = function() {
  switch (this.state) {
    case this.STATE_RUNNING:
      this._state(this.STATE_PAUSED);
      break;
    case this.STATE_PAUSED:
      this._state(this.STATE_RUNNING);
      this.step();
      break;
    case this.STATE_STOPPED:
      this.run();
      break;
  }
};

/**
 *
 */
Brainfuck.prototype.step = function() {
  if(this.sourcePos >= this.source.length) {
    this.emit('end', null);
    return;
  }
  var c;
  var ret;
  try {
    while(this.sourcePos < this.source.length) {
      c = this.source.charAt(this.sourcePos);
      if(c in commands && typeof commands[c] == 'function') {
        ret = commands[c].call(this);
        break;
      }
      else {
        this.sourcePos++;
      }
    }
  } catch (o_O) {
    console.error(o_O);
    this.stop(o_O);
  }
  this.emit('step', (typeof ret == 'string' ? ret : null));
  if(this.state === this.STATE_RUNNING) {
    setTimeout(function(bf) {
      bf.step();
    }, this.delay, this);
  }
};

exports.create = function() {
  return new Brainfuck();
};
/*module.exports = (function() {
  return new Brainfuck();
})();
*/
