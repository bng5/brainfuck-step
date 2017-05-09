var EventEmitter = require('events').EventEmitter
var commands = require('./commands')
var define = require('node-constants')(exports)

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
    sourcePos: -1,
    deep: [],
    instructionsPattern: /[-+\[\]<>.,]/g
  }
  var state = exports.STATE_STOPPED
  delay = (Number.isInteger(delay) && delay > 0) ? delay : 1000
  var reset = function () {
    data.cursor = 0
    data.tape = new Uint8Array(bufferSize)
    data.deep = []
    data.sourcePos = -1
    data.instructionsPattern.lastIndex = 0
  }
  var setState = function (newState) {
    state = newState
    brainfuck.emit('statechange', state)
  }
  var step = function () {
    try {
      var match = data.instructionsPattern.exec(data.source)
      if (match) {
        data.sourcePos = (data.instructionsPattern.lastIndex - 1)
        var c = match[0]
        if (c === ',') {
          if (inputBuffer && inputBuffer.length) {
            data.tape[data.cursor] = inputBuffer.shift().charCodeAt(0)
          } else if (!inputEnded) {
            setState(exports.STATE_WAITING)
            return
          }
        } else {
          var ret = commands[c].call(data)
          this.emit('step', (typeof ret === 'string' ? ret : null))
          if (state === exports.STATE_RUNNING) {
            setTimeout(function (bf) {
              step.call(bf)
            }, delay, this)
          }
        }
      } else {
        if (data.deep.length) {
          throw new Error('Unbalanced brackets')
        }
        this.emit('end', null)
      }
    } catch (err) {
      this.stop(err)
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
    setState.call(this, exports.STATE_STOPPED)
    this.emit('end', (err || null), 'output')
  }

  brainfuck.pause = function () {
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
