const ifs = require('os').networkInterfaces();
const crypto = require('crypto');
const format = require('biguint-format');

module.exports = class Utils {
  static localIp() {
  return  Object.keys(ifs)
    .map(x => ifs[x].filter(y => y.family === 'IPv4' && !y.internal)[0])
    .filter(z => z)[0].address;
  }

  static generateRandHash() {
    const x = crypto.randomBytes(8);
    const hash = crypto.createHash('sha256');
    hash.update(format(x, 'dec'));
    return hash.digest('hex');
  }
}
