const Path = require('path');

module.exports = function (options) {
  return {
    webpack: {
      description: 'Webpack: packing...',
      tasks: [
        `node ${ options.webpack.bin } --config ${ options.webpack
          .config } --progress --profile --colors --env.target='${ options.params
          .target }' --env.env='${ options.params.env }' --env.platform='${ options.params
          .platform }' --env.os='${ options.params.os }' --env.version='${ options.params
          .version }' --env.lang='${ options.params.lang }'`,
      ],
    },
    'copy-sources': {
      description: 'Coping sources...',
      tasks: [
        [
          'rm',
          '-rf',
          Path.join(
            options.cordova.buildPath,
            options.cordova.folderName || 'hello',
            options.sources.dest
          ),
        ],
        [
          'cp',
          '-R',
          options.sources.source,
          Path.join(
            options.cordova.buildPath,
            options.cordova.folderName || 'hello',
            options.sources.dest
          ),
        ],
      ],
    },
    'cordova-create': {
      description: 'Apache Cordova creating project...',
      tasks: [
        ['rm', '-rf', options.cordova.buildPath],
        ['mkdir', '-p', options.cordova.buildPath],
        (() => {
          return `${ options.cordova.bin } create ${ Path.join(
            options.cordova.buildPath,
            options.cordova.folderName || 'hello'
          ) } ${ options.cordova.domain || 'com.sample.hello' } ${ options.cordova.winTitle ||
            'HelloWorld' };`;
        })(),
        ['cd', Path.join(options.cordova.buildPath, options.cordova.folderName || 'hello')],
        (() => {
          return typeof options.params.os === 'string'
            ? `${ options.cordova.bin } platform add ${ options.params.os }`
            : options.params.os.map(item => `${ options.cordova.bin } platform add ${ item }`);
        })(),
      ],
    },
    'cordova-plugins': {
      description: 'Apache Cordova adding plugins...',
      tasks: [
        (() => {
          if (!options.cordova.plugins) return null;
          return !Array.isArray(options.cordova.plugins)
            ? `${ options.cordova.bin } plugins add ${ options.cordova.plugins }`
            : options.cordova.plugins.map(item => `${ options.cordova.bin } plugins add ${ item }`);
        })(),
      ],
    },
    'cordova-config': {
      description: 'Apache Cordova configuring...',
      tasks: [
        (path, CordorvaConfTool) => {
          return Promise((accept, reject) => {
            try {
              const origin = path.join(
                `${ options.baseDir }`,
                'builds/native/',
                `${ options.params.env }`,
                'config.xml'
              );
              const confTool = new CordorvaConfTool(origin, `${ options.cordova.configXmlActions }`);
              confTool.run();
              accept();
            } catch (err) {
              reject(err);
            }
          });
        },
      ],
    },
    'cordova-build': {
      description: 'Apache Cordova building....',
      tasks: [
        (() => {
          return !Array.isArray(options.cordova.platforms)
            ? `${ options.cordova.bin } build ${ options.cordova.platforms }`
            : options.cordova.platforms.map(item => `${ options.cordova.bin } build ${ item }`);
        })(),
      ],
    },
    'build-native-loc': {
      description: 'Building for native...',
      tasks: [
        '@webpack',
        '@cordova-create',
        '@copy-sources', '@cordova-plugins', '@cordova-build',
      ],
    },
  };
};
