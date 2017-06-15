const sh = require('shelljs');
const path = require('path');

const pp = path.join(process.cwd(), 'build');
console.log(pp);
sh.exec('cd ' + pp);
sh.exec('ls -l');
