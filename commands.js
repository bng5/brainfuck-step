var commands = {};

commands['>'] = function() {
    this.cursor++;
    if(this.cursor >= this.tape.length) {
        throw "Out of range! You wanted to '>' beyond the last cell.";
    }
    this.sourcePos++;
};

commands['<'] = function() {
    this.cursor--;
    if(this.cursor < 0) {
        throw "Out of range! You wanted to '<' below the first cell.";
    }
    this.sourcePos++;
};

commands['['] = function() {
    if(this.tape[this.cursor]) {
        this.deep.push(this.sourcePos);
        this.sourcePos++;
    }
    else {
        var pos = this.sourcePos;
        var char;
        var loops = this.deep.length;
        this.deep.push(this.sourcePos);
        do {
            this.sourcePos++;
            switch (this.source.charAt(this.sourcePos)) {
                case '[':
                    this.deep.push(this.sourcePos);
                    break;
                case ']':
                    this.deep.pop();
                    break;
            }
        } while(loops < this.deep.length);
    }
};

commands[']'] = function() {
    if(this.deep.length === 0) {
        throw "Unbalanced brackets";
    }
    if(!this.tape[this.cursor]) {
        this.sourcePos++;
console.error(this.deep);
        this.deep.pop();
    }
    else {
        this.sourcePos = this.deep[(this.deep.length - 1)];
        this.sourcePos++;
    }
};

commands['+'] = function() {
    this.tape[this.cursor]++;
    this.sourcePos++;
};

commands['-'] = function() {
    this.tape[this.cursor]--;
    this.sourcePos++;
};

commands['.'] = function() {
    this.sourcePos++;
    return String.fromCharCode(this.tape[this.cursor]);
};

commands[','] = function() {
    this.sourcePos++;
};

module.exports = commands;
