var bf = require('./index.js');
var fs = require('fs');
//var readline = require('readline');


/*
process.stdin.on('readable', () => {
  var chunk = process.stdin.read();
  if (chunk !== null) {
    process.stdout.write(`data: ${chunk}`);
    process.exit();
  }
});

const rl = readline.createInterface({
  input: fs.createReadStream('hello.b'),
  output: process.stdout
});
*/

//var hello = fs.readFileSync('hello.b', "utf8");

/*
rl.setPrompt('OHAI> ');
rl.question('What is your favorite food?', (answer) => {
  console.log(`Oh, so your favorite food is ${answer}`);
});
rl.prompt(false);

rl.on('line', (cmd) => {
  console.log(`You just typed: ${cmd}`);
});
*/

var output = '';
var printTape = function(tape, cursor) {
  var i;
  var start = 0;
  var columns = process.stdout.columns;
  var cells = Math.floor((columns - 1) / 6);
  console.log(cursor);
  var tapeStr = '|';
  var med = Math.floor(cells / 2);
  if (cursor > med) {
    start = (cursor - med);
  }
  if ((start + cells) > tape.length) {
      start = (tape.length - cells);
  }
  console.log(start, cursor, (cursor - start));
  for (i = start; i < (start + cells); i += 1) {
      tapeStr += ('             '+tape[i]+' |').slice(-6);
  }
  console.log(tapeStr);
  var cursorPos = '';
  for (i = 0; i < (cursor - start); i += 1) {
      cursorPos += '      ';
  }
  console.log(cursorPos+'   \u25B2');
  console.log(cursorPos+'   '+cursor);
};

bf.on('step', function(output_char) {
  if (output_char) {
    output += output_char;
  }
//  console.log('step', output_char);
  //console.log('\033c');
  //process.stdout.write("\x1B[2J");
  printTape(this.tape, this.cursor);
  console.log(output);
  //this.stop();
});

bf.on('end', function(error) {
  console.log('end', error);
});

bf.on('statechange', function(state) {
  switch (state) {
    case bf.STATE_RUNNING:
      console.log('Running');
      break;
    case bf.STATE_STOPPED:
      console.log('Stopped');
      break;
    case bf.STATE_PAUSED:
      console.log('Paused');
      break;
    case bf.STATE_WAITING:
      console.log('Waiting');
      var chunk = process.stdin.read();
      if (chunk !== null) {
        bf.write(chunk);
      }
      break;
    default:
      console.error('statechange', state);
      break;
  }
});

//bf.source = '>,[>,]<[.<]';
bf.source = '+[>,]<[.<]';
//fs.createReadStream('input.txt').pipe(bf.input);
bf.input.write('qwertyuiop\n'+
              // 'asdfghjkl\n'+
               'zxcvbnm');
bf.input.end();
//bf.source = hello;
//bf.source = '>>>+>>>+>>>+>>>+>>>+>>>+>>>+>>>+>>>+>>>+>>>+>>>+>>>+>>>+>>>+>>>+>>>+>>>+>>>+.'+
//            '<<<+<<<+<<<+<<<+<<<+<<<+<<<+<<<+<<<+<<<+<<<+<<<+<<<+<<<+<<<+<<<+<<<+<<<+<<<+.';
bf.delay = 200;

//console.log(bf);
bf.run();
