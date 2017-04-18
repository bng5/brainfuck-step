##### Constants

- STATE_STOPPED = 0
- STATE_RUNNING = 1
- STATE_PAUSED  = 2
- STATE_WAITING = 3

##### Properties:

- __source__             - _string_ Brainfuck code.
- __instructionPointer__ - _number_ Current command position.
- __delay__              - _number_ Time, in microseconds, between each step.
- __arraySize__          - _number_ Number of cells in the array.
- __dataPointer__        - _number_ Cell at the pointer.

##### Methods:

- __run__ -
- __stop__ -
- __pause__ -
- __toggleRun__ -
- __step__ -

##### Events:

- __end__
- __step__
- __statechange__
- __

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
