module.exports = {
  '>': function () {
    this.cursor++
    if (this.cursor >= this.tape.length) {
      throw new Error("Out of range! You wanted to '>' beyond the last cell.")
    }
  },
  '<': function () {
    this.cursor--
    if (this.cursor < 0) {
      throw new Error("Out of range! You wanted to '<' below the first cell.")
    }
  },
  '[': function () {
    if (this.tape[this.cursor]) {
      this.deep.push(this.sourcePos)
      // this.sourcePos++
    } else {
      // var pos = this.sourcePos
      // var char
      var loops = this.deep.length
      console.log(this.source)
      console.log(this.sourcePos, this.source.length)
      this.deep.push(this.sourcePos)
      do {
        // this.sourcePos++
        if (this.sourcePos >= this.source.length) {
          throw new Error('Unbalanced brackets')
        }
        switch (this.source.charAt(this.sourcePos)) {
          case '[':
            this.deep.push(this.sourcePos)
            break
          case ']':
            this.deep.pop()
            break
        }
      } while (loops < this.deep.length)
      // this.sourcePos++
    }
  },
  ']': function () {
    if (this.deep.length === 0) {
      throw new Error('Unbalanced brackets')
    }
    if (!this.tape[this.cursor]) {
      // this.sourcePos++
      console.error(this.deep)
      this.deep.pop()
    } else {
      this.sourcePos = this.deep[(this.deep.length - 1)]
      // this.sourcePos++
    }
  },
  '+': function () {
    this.tape[this.cursor]++
    // this.sourcePos++
  },
  '-': function () {
    this.tape[this.cursor]--
    // this.sourcePos++
  },
  '.': function () {
    return String.fromCharCode(this.tape[this.cursor])
  }/*
  ,
  ",": function() {
console.log(this);
throw 'esperando';
    this.sourcePos++;
  }
  */
}
