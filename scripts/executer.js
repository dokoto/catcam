const exec = require('child_process').exec;
const spawn = require('child_process').spawn;
const cliSpinner = require('./cliSpinner');

const LABEL = '[EXECUTER]';
require('colors');


module.exports = class Executer {
  constructor(tasks, params) {
    this.params = params;
    this.tasks = tasks;
    this.dotSpinner = new cliSpinner('dots');
  }

  taskIs(task) {
    switch (typeof task) {
      case 'string':
        return task[0] === '@' ? 'import' : 'string';
      case 'function' || 'object':
        return typeof task;
      default:
        return null;
    }
  }

  execCommand2(command) {
    return new Promise((accept, reject) => {
      exec(command, err => {
        if (err) {
          console.error(`${ LABEL } ${ err }`.red);
          console.error(`${ LABEL } ${ command }`.red);
          reject(err);
        }
        accept();
      });
    });
  }

  execCommand(command) {
    console.log(`Execute ${ command }`);
    return new Promise(accept => {
      const cmd = command.split(' ')[0];
      const argv = command.split(' ').splice(1);
      const proc = spawn(cmd, argv);
      proc.on('close', code => {
        console.log(`EXEC-COMMAND CLOSED ${ code } ${ accept }`);
        accept(code);
      });

      proc.stdout.on('data', data => console.debug(`${ data }`));
      proc.stderr.on('data', data => console.debug(`${ data }`));
    });
  }

  execFunc(func) {
    try {
      return func();
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  execFuncWithDeps(funcObj) {
    /* eslint-disable global-require*/
    try {
      const deps = [];
      const keys = Object.keys(funcObj.deps);
      for (let i = 0; i < keys.length; i++) {
        if ({}.hasOwnProperty.call(funcObj.deps, keys[i])) {
          /* eslint-disable */
          deps.push(require(keys[i]));
          /* eslint-enable */
        }
      }
      return funcObj.func.apply(...deps);
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  tasker2(taskName, index = 0) {
    if (!Object.prototype.hasOwnProperty.call(this.tasks, taskName)) {
      console.error(`${ LABEL } Task ${ taskName } not found`.red);
      process.exit(-1);
    }
    const tasks = this.tasks[taskName].tasks;
    if (tasks.length === index) return;


    if (!this.params.verbose) {
      this.dotSpinner.stop();
      this.dotSpinner.start(`${ LABEL } ${ this.tasks[taskName].description }`.blue);
    } else {
        console.log(`${ LABEL } ${ this.tasks[taskName].description }`.blue);
    }

    const taskType = this.taskIs(tasks[index]);
    switch (taskType) {
      case 'import': {
        this.tasker(tasks[index].slice(1));
        break;
      }
      case 'string': {
        this.execCommand(tasks[index])
          .then(this.tasker.bind(this, taskName, index + 1))
          .catch(err => console.error(err));
        break;
      }
      case 'function':
        this.execFunc(tasks[index])
          .then(this.tasker.bind(this, taskName, index + 1))
          .catch(err => console.error(err));
        break;
      case 'object':
        this.execFuncWithDeps(tasks[index])
          .then(this.tasker.bind(this, taskName, index + 1))
          .catch(err => console.error(err));
        break;
      default:
        break;
    }
  }

  tasker(taskName, index = 0) {
    if (!Object.prototype.hasOwnProperty.call(this.tasks, taskName)) {
      console.error(`${ LABEL } Task ${ taskName } not found`.red);
      process.exit(-1);
    }
    const tasks = this.tasks[taskName].tasks;
    if (tasks.length === index) return;

    console.log(`${ LABEL } ${ this.tasks[taskName].description }`.blue);

    const taskType = this.taskIs(tasks[index]);
    switch (taskType) {
      case 'import': {
        this.tasker(tasks[index].slice(1));
      }
      case 'string' || 'function' || 'object' : {
        return  {
          taskType,
          tasks[index],
        }
      }
      default:
        break;
    }

    if (tasks.length < index) this.tasker(tasks[index + 1]);
  }

  run(taskName) {
    try {
      this.tasker(taskName);
    } catch (err) {
      console.error(err);
    }
  }
};

>>>>
(function() {

    class Ttt {
        constructor() {
            this.commands = [];
            this.tasks = {
                  webpack: {
                    tasks: [`node`],
                  },
                'copy-sources': {
                  description: 'Coping sources...',
                  tasks: [`node`],
                },
                'cordova-create': {
                  description: 'Apache Cordova creating project...',
                  tasks: [`node`],
                },
                'cordova-plugins': {
                  description: 'Apache Cordova adding plugins...',
                  tasks: [`node`],
                },
                'cordova-config': {
                  description: 'Apache Cordova configuring...',
                  tasks: [`node`],
                },
                'cordova-build': {
                  description: 'Apache Cordova building....',
                  tasks: [`node`],
                },
                'build-native-loc': {
                    tasks: ['@webpack', '@cordova-create', '@copy-sources', '@cordova-plugins', '@cordova-build']
                }
            };
        }

        taskIs(task) {
            switch (typeof task) {
              case 'string':
                return task[0] === '@' ? 'import' : 'string';
              case 'function' || 'object':
                return typeof task;
              default:
                return null;
            }
        }

        tasker(taskName, cmds = [])  {
            const index = Object.keys(this.tasks).indexOf(taskName);
            const tasks = this.tasks[taskName].tasks;
            if (tasks.length === index) return;
            const taskType = this.taskIs(tasks[index]);
            if (taskType === 'import') {
                cmds.push(this.tasker(tasks[index].slice(1)), cmds);
            } else if (taskType === 'string' || taskType === 'function' || taskType === 'object') {
                return {
                    taskType,
                    name: tasks[index],
                };
            }
            if (index < tasks.length) {
                ret = this.tasker(tasks[index + 1], cmds);
            }
        }
    }

    const tt = new Ttt();
    tt.tasker('build-native-loc');


})();
