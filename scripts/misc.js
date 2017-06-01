

module.exports = {
  convBoolean(options, key, defaultValue) {
    if (typeof options(key) === 'boolean') {
      return options(key);
    }
    const stringBoolean = options(key);
    if (stringBoolean) {
      if (stringBoolean === 'true') {
        return true;
      } else if (stringBoolean === 'false') {
        return false;
      }
      return defaultValue;
    }
    return defaultValue;
  },
  resolveComplexVal(options, funcNode) {
    try {
      if (options === undefined) {
        throw 'options is undefined';
      }

      if (funcNode === undefined) {
        throw 'funcNode is undefined';
      }

      if (typeof funcNode === 'string') {
        return funcNode;
      } else if (typeof funcNode === 'object') {
        let dFunc;
        let i;
        const funcDeps = [options];
        const funcDepsTxt = ['options'];

        for (i = 0; i < funcNode.nodeLibs.length; i++) {
          funcDeps.push(require(funcNode.nodeLibs[i]));
          funcDepsTxt.push(funcNode.nodeLibs[i]);
        }
        funcDepsTxt.push(funcNode.code);
        try {
          dFunc = Function(...funcDepsTxt);
          const result = dFunc(...funcDeps);
          return result;
        } catch (error) {
          console.error(error);
        }
      }
    } catch (error) {
      console.error(error);
    }
  },
};
