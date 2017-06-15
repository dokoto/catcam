const { execFile } = require('child_process');
const cliSpinner = require('./cliSpinner');
const sh = require('shelljs');

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
      case 'function':
        return typeof task;
      case 'object':
        return Array.isArray(task) ? 'array' : 'object';
      default:
        return null;
    }
  }

  execCommand(command) {
    console.debug(`${ LABEL } Execute ${ command }`);
    return new Promise((accept, reject) => {
      try {
        const cmd = command.split(' ')[0];
        const argv = command.split(' ').splice(1);
        const proc = execFile(cmd, argv);

        proc.on('close', code => {
          console.debug(`${ LABEL } >>> Command finished with code: ${ code } <<<`);
          if (code === 0) {
            accept(code);
          } else {
            reject(code);
          }
        });
        proc.stdout.on('data', data => console.debug(`${ data }`));
        proc.stderr.on('data', data => console.debug(`${ data }`));
        proc.on('error', err => console.log(`${ LABEL } ${ err.message }`.red));
      } catch (err) {
        console.log(`${ LABEL } ${ err.message }`.red);
        console.log(`${ LABEL } ${ err.stack }`.red);
      }
    });
  }

  shelljsSpecials(command) {
    console.debug(`${ LABEL } ShelljsSpecials ${ command.join(' ') }`);
    return new Promise((accept, reject) => {
      try {
        const cmd = command.shift();
        sh[cmd](...command);
        accept();
      } catch (err) {
        console.log(`${ LABEL } ${ err.message }`.red);
        console.log(`${ LABEL } ${ err.stack }`.red);
        reject(err);
      }
    });
  }

  /*
   * Command es un array con comandos definidos en la libreria shelljs
   */
  shelljs(command) {
    if (['cd'].indexOf(command[0]) !== -1) return this.shelljsSpecials(command);
    console.debug(`${ LABEL } Shelljs ${ command.join(' ') }`);
    return new Promise((accept, reject) => {
      try {
        const proc = sh.exec(command.join(' '), { async: true });

        proc.on('close', code => {
          console.debug(`${ LABEL } >>> Command finished with code: ${ code } <<<`);
          if (code === 0) {
            accept(code);
          } else {
            reject(code);
          }
        });
        proc.stdout.on('data', data => console.debug(`${ data }`));
        proc.stderr.on('data', data => console.debug(`${ data }`));
        proc.on('error', err => console.log(`${ LABEL } ${ err.message }`.red));
      } catch (err) {
        console.log(`${ LABEL } ${ err.message }`.red);
        console.log(`${ LABEL } ${ err.stack }`.red);
      }
    });
  }

  execFunction(func) {
    console.debug(`${ LABEL } Function ${ func.toString() }`);
    const params = func.toString().match(/function\s.*?\(([^)]*)\)/);
    if (params === null) {
      throw new Error(
        'No array function allowed, all function must be return a Promise as : function(dep1, dep2...) { return new Promise((a, r) => {}); }'
      );
    }
    /* eslint-disable global-require,import/no-dynamic-require*/
    const deps = params && params[1].split(',').map(item => deps.push(require(item)));
    /* eslint-enable global-require*/
    return func(...deps);
  }

  processTaskPool(tasksToExec) {
    const taskToExec = tasksToExec.shift();
    if (!taskToExec) {
      if (!this.params.verbose) this.dotSpinner.stop();
      return;
    }

    if (!this.params.verbose) {
      this.dotSpinner.stop();
      this.dotSpinner.start(
        `${ LABEL } ${ taskToExec.description }`.blue + ` ${ taskToExec.task.substr(0, 20) }`.yellow
      );
    } else {
      console.log(`${ LABEL } ${ taskToExec.description }`.blue);
    }

    switch (taskToExec.taskType) {
      case 'string':
        this.execCommand(taskToExec.task)
          .then(this.processTaskPool.bind(this, tasksToExec))
          .catch(this.handleCmdError.bind(this));
        break;
      case 'array':
        this.shelljs(taskToExec.task)
          .then(this.processTaskPool.bind(this, tasksToExec))
          .catch(this.handleCmdError.bind(this));
        break;
      case 'function':
        this.execFunction(taskToExec.task)
          .then(this.processTaskPool.bind(this, tasksToExec))
          .catch(this.handleCmdError.bind(this));
        break;
      default:
    }
  }

  handleCmdError(err) {
    if (!this.params.verbose && this.dotSpinner) this.dotSpinner.stop();
    console.error(`${ LABEL } Process finish with error code: ${ err }`.red);
  }

  tasker(description, tasks, cmds = []) {
    const task = tasks.shift();
    const taskType = this.taskIs(task);

    if (taskType === 'import') {
      this.tasker(this.tasks[task.slice(1)].description, this.tasks[task.slice(1)].tasks, cmds);
    } else if (taskType === 'string' || taskType === 'array') {
      cmds.push({ description, taskType, task });
    } else if (taskType === 'function') {
      const funcResult = task();
      if (Array.isArray(funcResult)) {
        funcResult.map(item => cmds.push({ description, taskType, task: item }));
      } else if (typeof funcResult === 'string') {
        cmds.push({ description, taskType, task: funcResult });
      } else {
        console.error(`${ LABEL } Task type no allowed ${ typeof tasks }`.red);
      }
    }

    if (tasks.length) {
      this.tasker(description, tasks, cmds);
    }

    return cmds;
  }

  run(taskName) {
    try {
      const tasksToExec = this.tasker(
        this.tasks[taskName].description,
        this.tasks[taskName].tasks.slice()
      );
      this.processTaskPool(tasksToExec);
    } catch (err) {
      console.error(err);
    }
  }
};
