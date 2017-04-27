# bfstep

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

``` bash
$ npm install bfstep --save
```

## Documentation

### Module Methods:

__create ( [ _number_ arraySize = 30000] )__ Creates a new brainfuck interpreter instance.

### Module Constants

- STATE_STOPPED = 0
- STATE_RUNNING = 1
- STATE_PAUSED  = 2
- STATE_WAITING = 3

### Interpreter

#### Properties:

- __arraySize__          - (_number_) Number of cells in the array.
- __dataPointer__        - (_number_) Cell at the pointer.
- __delay__              - (_number_) Time, in microseconds, between each step.
- __instructionPointer__ - (_number_) Current command position.
- __source__             - (_string_) Brainfuck code.


#### Methods:

__run()__       - Start or resume program execution.

__pause()__     - Halt program execution.
<<<<<<< HEAD

__next()__      -

__stop()__      - Stop execution (Break).

__toggleRun()__ - Pause or resume program execution.

#### Events:

##### end

=======

__next()__      -

__stop()__      - Stop execution (Break).

__toggleRun()__ - Pause or resume program execution.

#### Events:

##### end

>>>>>>> dcb4538e26b491458ab9c2a9a665cb2ba46465f4
Emitted when the program has ended.

Arguments:
1. ( *null* | *Error* ) If the first argument is not *null* and is an instance of *Error*, the program could not end successfully.
 
##### statechange

The state of the interpreter has changed.

Arguments:
 - ( *number* ) The interpreter's new running status. Any of the module's STATE_* constants.

##### step


#### Example

``` js
var bfstep = require('bfstep')

var bf = bfstep.create(10)

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

```
EventEmitter {
  run: [Function],
  stop: [Function],
  pause: [Function],
  step: [Function],
  toggleRun: [Function],
  state: [Getter],
  arraySize: [Getter/Setter],
  cursor: [Getter],
  source: [Getter/Setter],
  tape: [Getter],
  position: [Getter],
  delay: [Getter/Setter],
  input: [Getter],
  _events: { step: [Function] },
  _eventsCount: 1
}
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
