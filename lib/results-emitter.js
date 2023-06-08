'use strict';

const EventEmitter = require('events');

let testNumber = 0;
let testTotal = global._tests_.length;

class ResultsEmitter extends EventEmitter {
  constructor(subject) {
    super();

    let started = false;

    const next = test => {
      if (!started) {
        this.emit('start');
        started = true;
      }

      testNumber++;
      if (test.result.pass) {
        console.error('PASS', `${testNumber}/${testTotal}`, test.file);
        this.emit('pass', test);
      } else {
        console.error('FAIL', `${testNumber}/${testTotal}`, test.file);
        console.error(test.rawResult.stderr);
        this.emit('fail', test);
      }

      this.emit('test end', test);
    };

    const complete = () => {
      this.emit('end');
    };

    const error = (error) => {
      this.emit('error', error);
    };

    subject.subscribe({
      complete, error, next
    });
  }
}

module.exports = ResultsEmitter;
