'use strict';

const EventEmitter = require('events');

let testNumber = 0;
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
        console.error('PASS', `${testNumber}`, test.file);
        this.emit('pass', test);
      } else {
        console.error('FAIL', `${testNumber}`, test.file);
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
