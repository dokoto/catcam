const Params = require('./params');
const TaskMaker = require('./taskmaker');
const Executer = require('./executer');


const parsedParams = Params.get();
if (parsedParams.options.help) {
  console.log('Usage:');
  console.log(parsedParams.usage);
  process.exit(-1);
}

const taskMaker = new TaskMaker(parsedParams.options);
const tasks = taskMaker.build();
Executer.run(tasks);
