const Params = require('./params');
const Tasks = require('./tasks');
const Executer = require('./executer');


const parsedParams = Params.get();
if (parsedParams.options.help) {
  console.log('Usage:');
  console.log(parsedParams.usage);
  process.exit(-1);
}


const executer = new Executer(Tasks(parsedParams.options));
executer.run(`build-${ parsedParams.options.platform }-${ parsedParams.options.target }`);
