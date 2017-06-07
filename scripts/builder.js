const path = require('path');
const Params = require('./params');
const Tasks = require('./tasks');
const Executer = require('./executer');

const debuglog = level => (msg, ...argv) => level && console.log.apply(this, [msg, ...argv]);
console.debug = debuglog(Params.verbose);

const executer = new Executer(
  Tasks({
    baseDir: process.cwd(),
    params: Params,
    webpack: {
      bin: path.join(process.cwd(), 'node_modules/webpack/bin/webpack.js'),
      config: path.join(__dirname, 'webpack.config.js'),
    },
    cordova: {
      bin: path.join(process.cwd(), 'node_modules/cordova/bin/cordova'),
      folderName: 'catcam',
      domain: 'net.catcam',
      winTitle: 'Catcam',
      plugins: [],
    },
  })
, Params);

executer.run(`build-${ Params.platform }-${ Params.env }`);
