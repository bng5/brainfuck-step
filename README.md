# brainfuck-step

A brainfuck interpreter that emits events on every step.

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

``` bash
$ npm install brainfuck-step --save
```

## Module Constants

- brainfuckstep.STATE_STOPPED = 0
- brainfuckstep.STATE_RUNNING = 1
- brainfuckstep.STATE_PAUSED  = 2
- brainfuckstep.STATE_WAITING = 3

## Constructor

_EventEmitter_ __brainfuckstep.create ( [arraySize] )__

 - arraySize
   - type: number
   - default: 30000

```js
var brainfuckstep = require('brainfuck-step')

var interpreter = brainfuckstep.create()
```

### Properties:

- __dataPointer__        - Read only (_number_) Current cell at the pointer.
- __delay__              - (_number_) Time, in microseconds, between each step.
- __programPointer__ - Read only (_number_) Current position command at the source.
- __source__             - (_string_) Brainfuck code.
- __tape__               - Read only (_Uint8Array_) Array of memory cells.

### Methods:

#### run

Start or resume program execution.

__interpreter.run()__

#### pause

Halt program execution.

__interpreter.pause()__

#### next

Executes the next instruction. Only when paused.

__interpreter.next()__

#### stop

Stop execution (Break).

__interpreter.stop()__

#### toggleRun

Pause or resume program execution.

__interpreter.toggleRun()__

### Events:

#### end

The program has ended.

 - Arguments:
   1. ( *null* | *Error* ) If the first argument is not *null* and is an instance of *Error*, the program could not end successfully.
 
#### statechange

The state of the interpreter has changed.

 - Arguments:
   1. ( *number* ) The interpreter's new running status. Any of the module's STATE_* constants.

#### step

An instruction has been processed.

 - Arguments
   1. ( *null* | *string* ) The output character signified by the cell at the pointer if the instruction is to print. *null* otherwise.

### Example

``` js
var brainfuck = require('brainfuck-step')

var bf = brainfuck.create(10)

bf.on('step', function (output) {
  console.log('dataPointer:    %d', this.dataPointer)
  console.log('programPointer: %d', this.programPointer)
  console.log(this.tape.join(' | '))
  var charPos = (this.programPointer - 1)
  console.log([this.source.substring(0, charPos), '\x1b[7m', this.source.substr(charPos, 1), '\x1b[0m', this.source.substring(charPos + 1)].join(''))
  console.log('Output: %s\n', output)
})

bf.on('statechange', function (newState) {
  console.log('The interpreter state has changed to %d', newState)
})

bf.on('end', function (err, b) {
  if (err) {
    console.error('ERROR: %s', err.message)
  }
  console.log('Program ended')
})

bf.source = '++++++++[>++++++++<-]>.'// print @ (8*8)
bf.run()
```

#### License (ISC)

Copyright (c) 2016, Pablo Bangueses <pablo@bng5.net>

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
