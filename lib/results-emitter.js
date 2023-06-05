'use strict';

const EventEmitter = require('events');

class ResultsEmitter extends EventEmitter {
  constructor(subject) {
    super();

    let started = false;

    const next = test => {
      if (!started) {
        this.emit('start');
        started = true;
      }

      if (test.result.pass) {
        console.error('PASS', test.file);
        this.emit('pass', test);
      } else {
        console.error('FAIL', test.file);
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
