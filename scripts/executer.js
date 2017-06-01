const exec = require('child_process').exec;

module.exports = class Executer {
  constructor(tasks) {
    this.tasks = tasks;
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
    return new Promise((accept, reject) => {
      exec(command, (err, stdout, stderr) => {
        if (err) reject(err);
        accept(stdout, stderr);
      });
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

  tasker(taskName, index = 0) {
    const tasks = this.tasks[taskName].tasks;
    if (tasks.length === index) return null;

    console.log(this.tasks[taskName].description);
    const taskType = this.taskIs(tasks[index]);
    switch (taskType) {
      case 'import': {
        this.tasker(tasks[index].slice(1));
        break;
      }
      case 'string': {
        this.execCommand(tasks[index])
          .then(this.tasker(taskName, index + 1))
          .catch(err => console.error(err));
        break;
      }
      case 'function':
        this.execFunc(tasks[index])
          .then(this.tasker(taskName, index + 1))
          .catch(err => console.error(err));
        break;
      case 'object':
        this.execFuncWithDeps(tasks[index])
          .then(this.tasker(taskName, index + 1))
          .catch(err => console.error(err));
        break;
      default:
        break;
    }

    return null;
  }

  run(taskName) {
    try {
      this.tasker(taskName);
    } catch (err) {
      console.error(err);
    }
  }
};
