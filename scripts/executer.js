const { spawn } = require('child_process');
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

  execCommand(command) {
    console.debug(`Execute ${ command }`);
    return new Promise(accept => {
      try {
        const cmd = command.split(' ')[0];
        const argv = command.split(' ').splice(1);
        const proc = spawn(cmd, argv);

        proc.on('close', code => {
          console.log(`${ LABEL } >>> Command finished with code: ${ code } <<<`);
          accept(code);
        });
        proc.stdout.on('data', data => console.debug(`${ LABEL } ${ data }`));
        proc.stderr.on('data', data => console.debug(`${ LABEL } ${ data }`));
        proc.on('error', (err) => console.log(err));
      } catch (err) {
        console.log(`${ LABEL } ${ err.message }`.red);
        console.log(`${ LABEL } ${ err.stack }`.red);
      }
    });
  }

  processCmdPool(commandsToExec) {
    const cmdToExec = commandsToExec.shift();
    if (!cmdToExec) {
      if (!this.params.verbose) this.dotSpinner.stop();
      return;
    }

    if (!this.params.verbose) {
      this.dotSpinner.stop();
      this.dotSpinner.start(`${ LABEL } ${ cmdToExec.description }`.blue);
    } else {
      console.log(`${ LABEL } ${ cmdToExec.description }`.blue);
    }

    this.execCommand(cmdToExec.task)
      .then(this.processCmdPool.bind(this, commandsToExec))
      .catch(err => console.error(err));
  }

  tasker(description, tasks, cmds = []) {
    const task = tasks.shift();
    const taskType = this.taskIs(task);

    if (taskType === 'import') {
      this.tasker(this.tasks[task.slice(1)].description, this.tasks[task.slice(1)].tasks, cmds);
    } else if (taskType === 'string') {
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
      const commandsToExec = this.tasker(
        this.tasks[taskName].description,
        this.tasks[taskName].tasks.slice()
      );
      this.processCmdPool(commandsToExec);
    } catch (err) {
      console.error(err);
    }
  }
};
