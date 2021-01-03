# brainfuck-step

Base brainfuck interpreter for debuggers.

Unlike other interpreters, which evaluate the whole code and return an output, *brainfuck-step* emits an event for each instruction.

[![Build Status](https://travis-ci.com/bng5/brainfuck-step.svg?branch=master)](https://travis-ci.com/bng5/brainfuck-step)
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

Returns a new brainfuck interpreter instance.

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
- __programPointer__ - Read only (_number_) Current position at the source. Source position is zero-based: the first character is in position 0.
- __source__             - (_string_) Brainfuck code.
- __tape__               - Read only (_Uint8Array_) Array of memory cells.

### Methods:

#### run()

Start or resume program execution.

#### pause()

Halt program execution.

#### next()

Executes the next instruction. Only when paused.

#### stop()

Stop execution (Break).

#### toggleRun()

Pause or resume program execution.

### Events:

#### end

The program has ended.

 - Arguments:
   1. ( *null* | *Error* ) This argument is *null* if the program has ended successfully. Otherwise it is an instance of *Error*.

#### statechange

The state of the interpreter has changed.

 - Arguments:
   1. ( *number* ) The interpreter's new running status. Any of the module's STATE_* constants.

#### step

An instruction has been processed.

 - Arguments
   1. ( *null* | *string* ) The output character signified by the cell at the pointer if the instruction is to print. *null* otherwise.

#### Example

```js
var brainfuck = require('brainfuck-step')

var bf = brainfuck.create(10)

bf.on('step', function (output) {
  console.log('dataPointer:    %d', this.dataPointer)
  console.log('programPointer: %d', this.programPointer)
  console.log(this.tape.join(' | '))
  console.log([
    this.source.substring(0, this.programPointer),
    '\x1b[7m',
    this.source.substr(this.programPointer, 1),
    '\x1b[0m',
    this.source.substring(this.programPointer + 1)
  ].join(''))
  if (output) {
    console.log('Output: %s\n', output)
  }
})

bf.on('statechange', function (newState) {
  console.log('The interpreter state has changed to %d', newState)
})

bf.on('end', function (err) {
  console.log('Program ended')
  if (err) {
    console.error('ERROR: %s', err.message)
  }
  console.log('dataPointer:    %d', this.dataPointer)
  console.log('programPointer: %d', this.programPointer)
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
