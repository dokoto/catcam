const Path = require('path');

module.exports = function (options) {
  return {
    webpack: {
      description: 'Webpack: packing...',
      tasks: [
        {
          type: 'SPAWN_COMMAND',
          action: `node ${ options.webpack.bin } --config ${ options.webpack
            .config } --progress --profile --colors --env.target='${ options.params
            .target }' --env.env='${ options.params.env }' --env.platform='${ options.params
            .platform }' --env.os='${ options.params.os }' --env.version='${ options.params
            .version }' --env.lang='${ options.params.lang }'`,
        },
      ],
    },
    'copy-sources': {
      description: 'Coping sources...',
      tasks: [
        {
          type: 'SHELLJS_COMMAND',
          action: [
            'rm',
            '-rf',
            Path.join(
              options.cordova.buildPath,
              options.cordova.folderName || 'hello',
              options.sources.dest
            ),
          ],
        },
        {
          type: 'SHELLJS_COMMAND',
          action: [
            'cp',
            '-R',
            options.sources.source,
            Path.join(
              options.cordova.buildPath,
              options.cordova.folderName || 'hello',
              options.sources.dest
            ),
          ],
        },
      ],
    },
    'cordova-create': {
      description: 'Apache Cordova creating project...',
      tasks: [
        {
          type: 'SHELLJS_COMMAND',
          action: ['rm', '-rf', options.cordova.buildPath],
        },
        {
          type: 'SHELLJS_COMMAND',
          action: ['mkdir', '-p', options.cordova.buildPath],
        },
        {
          type: 'SPAWN_COMMAND',
          action: (() => {
            return `${ options.cordova.bin } create ${ Path.join(
              options.cordova.buildPath,
              options.cordova.folderName || 'hello'
            ) } ${ options.cordova.domain || 'com.sample.hello' } ${ options.cordova.winTitle ||
              'HelloWorld' };`;
          })(),
        },
        {
          type: 'SHELLJS_COMMAND',
          action: [
            'cd',
            Path.join(options.cordova.buildPath, options.cordova.folderName || 'hello'),
          ],
        },
        {
          type: 'SPAWN_ARRAY_COMMAND',
          action: () => {
            return typeof options.params.os === 'string'
              ? `${ options.cordova.bin } platform add ${ options.params.os }`
              : options.params.os.map(item => `${ options.cordova.bin } platform add ${ item }`);
          },
        },
      ],
    },
    'cordova-plugins': {
      description: 'Apache Cordova adding plugins...',
      tasks: [
        {
          type: 'SPAWN_ARRAY_COMMAND',
          action: () => {
            if (!options.cordova.plugins) return null;
            return !Array.isArray(options.cordova.plugins)
              ? `${ options.cordova.bin } plugins add ${ options.cordova.plugins }`
              : options.cordova.plugins.map(item => `${ options.cordova.bin } plugins add ${ item }`);
          },
        },
      ],
    },
    'cordova-config': {
      description: 'Apache Cordova configuring...',
      tasks: [
        {
          type: 'FUNTION_PROMISE',
          action: function (path, CordorvaConfTool) {
            return Promise((accept, reject) => {
              try {
                const origin = path.join(
                  `${ options.baseDir }`,
                  'builds/native/',
                  `${ options.params.env }`,
                  'config.xml'
                );
                const confTool = new CordorvaConfTool(
                  origin,
                  `${ options.cordova.configXmlActions }`
                );
                confTool.run();
                accept();
              } catch (err) {
                reject(err);
              }
            });
          },
        },
      ],
    },
    'cordova-build': {
      description: 'Apache Cordova building....',
      tasks: [
        {
          type: 'SPAWN_ARRAY_COMMAND',
          action: () => {
            return !Array.isArray(options.params.os)
              ? `${ options.cordova.bin } build ${ options.params.os }`
              : options.params.os.map(item => `${ options.cordova.bin } build ${ item }`);
          },
        },
      ],
    },
    'build-native-loc': {
      description: 'Building for native...',
      tasks: [
        {
          type: 'IMPORT',
          action: 'webpack',
        },
        {
          type: 'IMPORT',
          action: 'cordova-create',
        },
        {
          type: 'IMPORT',
          action: 'cordova-plugins',
        },
        {
          type: 'IMPORT',
          action: 'copy-sources',
        },
        {
          type: 'IMPORT',
          action: 'cordova-config',
        },
        {
          type: 'IMPORT',
          action: 'cordova-build',
        },
      ],
    },
  };
};
