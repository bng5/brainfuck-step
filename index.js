var EventEmitter = require("events").EventEmitter;
var commands     = require('./commands');
var stream       = require('stream');

var STATE_STOPPED = 0,
    STATE_RUNNING = 1,
    STATE_PAUSED  = 2;
    STATE_WAITING = 3;

module.exports = (function() {
    
  var inputBuffer;
  var inputEnded = false;
  var input = {
    write: function(str) {
      inputBuffer = str.split('');
    },
    end: function() {
      inputEnded = true;
    }
  };
  /*
  var input = new stream.Writable();
  input._write = function (chunk, encoding, done) {
    inputBuffer = chunk.toString();
    //console.log('encoding', encoding);
    done();
    process.exit();
  };
  */

  var brainfuck = Object.create(EventEmitter.prototype);

  var bufferSize = 58;
  var data = {
    source: '',
    cursor: 0,
    tape: null,
    sourcePos: 0,
    deep: []
  };
  var state = STATE_STOPPED;
  var delay = 1000;
  var reset = function() {
    data.cursor = 0;
    data.tape = new Uint8Array(bufferSize);
    data.deep = new Array();
  };
  var setState = function(newState) {
    state = newState;
    brainfuck.emit('statechange', state);
  };
  var step = function() {
    if (data.sourcePos >= data.source.length) {
      this.emit('end', null);
      return;
    }
    var c;
    var ret;
//    try {
      while(data.sourcePos < data.source.length) {
        c = data.source.charAt(data.sourcePos);
        if(c in commands && typeof commands[c] == 'function') {
          ret = commands[c].call(data);
          break;
        }
        else if (c === ',') {
          data.sourcePos++;
          if (inputBuffer && inputBuffer.length) {
            data.tape[data.cursor] = inputBuffer.shift().charCodeAt(0);
          }
          else if(!inputEnded) {
            setState(STATE_WAITING);
            return;
          }
        }
        else {
          data.sourcePos++;
        }
      }
//    } catch (o_O) {
//      console.error(o_O);
//      this.stop(o_O);
//    }
    this.emit('step', (typeof ret == 'string' ? ret : null));
    if(state === STATE_RUNNING) {
      setTimeout(function(bf) {
        step.call(bf);
      }, delay, this);
    }
  };

  brainfuck['run'] = function() {
    if (state === STATE_STOPPED) {
      reset();
    }
    setState.call(this, STATE_RUNNING);
    step.call(this);
  };

  brainfuck['stop'] = function(error_str) {
    if(state === STATE_STOPPED) {
      return;
    }
    setState.call(this, STATE_STOPPED);
    this.emit('end', {message: error_str}, 'output');
  };

  brainfuck['pause'] = function(error_str) {
    if(state === STATE_PAUSED) {
      return;
    }
    setState.call(this, STATE_PAUSED);
  };

  brainfuck['step'] = function() {
    if (state === STATE_RUNNING) {
      return;
    }
  };
  
  brainfuck['toggleRun'] = function() {
/*
switch (this.state) {
  case STATE_RUNNING:
    this._state(STATE_PAUSED);
    break;
  case STATE_PAUSED:
    this._state(STATE_RUNNING);
    this._step();
    break;
  case STATE_STOPPED:
    this.run();
    break;
}
*/
    if (state === STATE_RUNNING) {
        this.pause();
    }
    else {
        this.run();
    }
  };
  
  Object.defineProperty(brainfuck, 'STATE_STOPPED', {
    value: STATE_STOPPED,
    enumerable: false,
    writable: false
  });
  Object.defineProperty(brainfuck, 'STATE_RUNNING', {
    value: STATE_RUNNING,
    enumerable: false,
    writable: false
  });
  Object.defineProperty(brainfuck, 'STATE_PAUSED', {
    value: STATE_PAUSED,
    enumerable: false,
    writable: false
  });
  Object.defineProperty(brainfuck, 'STATE_WAITING', {
    value: STATE_WAITING,
    enumerable: false,
    writable: false
  });
  Object.defineProperty(brainfuck, 'state', {
    get: function() { return state; },
    enumerable: true
  });
  Object.defineProperty(brainfuck, 'cursor', {
    get: function() { return data.cursor; },
    enumerable: true
  });
  Object.defineProperty(brainfuck, 'source', {
    get: function() { return data.source; },
    set: function(src) { data.source = src; },
    enumerable: true
  });
  Object.defineProperty(brainfuck, 'tape', {
    get: function() { return data.tape; },
    enumerable: true
  });
  Object.defineProperty(brainfuck, 'position', {
    get: function() { return data.sourcePos; },
    enumerable: true
  });
  Object.defineProperty(brainfuck, 'delay', {
    get: function() { return delay; },
    set: function(time) {
        if (typeof time === 'number' && time >= 0) {
          delay = time;
        }
     },
    enumerable: true
  });
  Object.defineProperty(brainfuck, 'input', {
    get: function() { return input; },
    enumerable: true
  });
  return brainfuck;
})();
