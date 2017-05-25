const nopt = require('nopt');

const knownOpts = {
  mocks: Boolean,
};

const shortHands = {
  m: '--mocks',
};

module.exports = class Options {
  static get() {
    return nopt(knownOpts, shortHands, process.argv, 2);
  }
};
