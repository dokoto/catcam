'use strict';

const cliSpinners = require('cli-spinners');
const logUpdate = require('log-update');

module.exports = class Spinner {
  constructor(spinnerType) {
    this.spinner = cliSpinners[spinnerType];
    this.i = 0;
    this.interval = null;
  }

  _next() {
    const frames = this.spinner.frames;
    logUpdate(this.msg + ' ' + frames[this.i = ++this.i % frames.length]);
  }

  start(msg) {
    this.i = 0;
    this.msg = msg;
    this.interval = setInterval(this._next.bind(this), this.spinner.interval);
  }

  stop() {
    if (this.interval) clearInterval(this.interval);
    this.interval = null;
    if (this.msg) {
      logUpdate.clear();
      console.log(this.msg);
    }
  }
}
