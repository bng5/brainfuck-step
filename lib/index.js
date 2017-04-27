var EventEmitter = require('events').EventEmitter
var commands = require('./commands')
var define = require('node-constants')(exports)
// var stream       = require('stream')

define({
  STATE_STOPPED: 0,
  STATE_RUNNING: 1,
  STATE_PAUSED: 2,
  STATE_WAITING: 3
})

exports.create = function (bufferSize, delay) {
  /*
  var input = new stream.Writable()
  input._write = function (chunk, encoding, done) {
    inputBuffer = chunk.toString()
    //console.log('encoding', encoding)
    done()
    process.exit()
  }
  */

  var inputBuffer = []
  var inputEnded = false
  var input = {
    write: function (str) {
      // inputBuffer.concat(str.split(''))
      Array.prototype.splice.apply(inputBuffer, [inputBuffer.length, 0].concat(str.split('')))
      // if (brainfuck.state === STATE_WAITING) {
      setState(exports.STATE_RUNNING)
      step.call(brainfuck)
      // }
    },
    end: function () {
      inputEnded = true
    }
  }

  bufferSize = (Number.isInteger(bufferSize) && bufferSize > 0) ? bufferSize : 30000
  var data = {
    source: '',
    cursor: 0,
    tape: new Uint8Array(bufferSize),
    sourcePos: 0, // -1,
    deep: []
  }
  var state = exports.STATE_STOPPED
  delay = (Number.isInteger(delay) && delay > 0) ? delay : 1000
  var reset = function () {
    data.cursor = 0
    data.tape = new Uint8Array(bufferSize)
    data.deep = []
  }
  var setState = function (newState) {
    state = newState
    brainfuck.emit('statechange', state)
  }
  var step = function () {
    // data.sourcePos++
    if (data.sourcePos >= data.source.length) {
      this.emit('end', null)
      return
    }
    var c
    var ret
    try {
      while (data.sourcePos < data.source.length) {
        c = data.source.charAt(data.sourcePos)
        if (c in commands && typeof commands[c] == 'function') {
          ret = commands[c].call(data)
          break
        } else if (c === ',') {
          data.sourcePos++
          if (inputBuffer && inputBuffer.length) {
            data.tape[data.cursor] = inputBuffer.shift().charCodeAt(0)
          } else if (!inputEnded) {
            setState(exports.STATE_WAITING)
            return
          }
        } else {
          data.sourcePos++
        }
      }
    } catch (err) {
      this.stop(err)
    }
    this.emit('step', (typeof ret == 'string' ? ret : null))
    if (state === exports.STATE_RUNNING) {
      setTimeout(function (bf) {
        step.call(bf)
      }, delay, this)
    }
  }

  var brainfuck = Object.create(EventEmitter.prototype)
  brainfuck.run = function () {
    if (state === exports.STATE_STOPPED) {
      reset()
    }
    setState.call(this, exports.STATE_RUNNING)
    step.call(this)
  }

  brainfuck.stop = function (err) {
    if (state === exports.STATE_STOPPED) {
      return
    }
    data.sourcePos = 0
    setState.call(this, exports.STATE_STOPPED)
    this.emit('end', (err ? err : null), 'output')
    // rl.close()
  }

  brainfuck.pause = function (errorStr) {
    if (state === exports.STATE_PAUSED) {
      return
    }
    setState.call(this, exports.STATE_PAUSED)
  }

  brainfuck.step = function () {
    if (state === exports.STATE_RUNNING) {
    }
  }

  brainfuck.toggleRun = function () {
    if (state === exports.STATE_RUNNING) {
      this.pause()
    } else {
      this.run()
    }
  }

  Object.defineProperty(brainfuck, 'state', {
    get: function () { return state },
    enumerable: true
  })
  Object.defineProperty(brainfuck, 'arraySize', {
    get: function () { return bufferSize },
    set: function (num) { bufferSize = num },
    enumerable: true
  })
  Object.defineProperty(brainfuck, 'dataPointer', {
    get: function () { return data.cursor },
    enumerable: true
  })
  Object.defineProperty(brainfuck, 'source', {
    get: function () { return data.source },
    set: function (src) { data.source = src },
    enumerable: true
  })
  Object.defineProperty(brainfuck, 'tape', {
    get: function () { return data.tape },
    enumerable: true
  })
  Object.defineProperty(brainfuck, 'programPointer', {
    get: function () { return data.sourcePos },
    enumerable: true
  })
  Object.defineProperty(brainfuck, 'delay', {
    get: function () { return delay },
    set: function (time) {
      time = parseInt(time)
      if (typeof time === 'number' && time >= 0) {
        delay = time
      }
    },
    enumerable: true
  })
  Object.defineProperty(brainfuck, 'input', {
    get: function () { return input },
    enumerable: true
  })
  return brainfuck
}
