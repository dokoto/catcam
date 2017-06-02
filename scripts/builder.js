const path = require('path');
const Params = require('./params');
const Tasks = require('./tasks');
const Executer = require('./executer');

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
);

executer.run(`build-${ Params.platform }-${ Params.env }`);
