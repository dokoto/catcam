module.exports = function (options) {
  // console.log(JSON.stringify(options, null, '\t'));
  return {
    webpack: {
      description: 'Webpack: packing...',
      tasks: [
        `node ${ options.webpack.bin } --config ${ options.webpack.config } --progress --profile --colors --env.target='${ options.params.target }' --env.env='${ options.params.env }' --env.platform='${ options.params.platform }' --env.os='${ options.params.os }' --env.version='${ options.params.version }' --env.lang='${ options.params.lang }'`,
      ],
    },
    'copy-sources': {
      description: 'Coping sources...',
      tasks: [
        {
          deps: {
            fs: 'fs-extra',
          },
          func: fs => {
            fs.removeSync(options['copy-sources'].dest);
            fs.copySync(options['copy-sources'].source, options['copy-sources'].dest);
          },
        },
      ],
    },
    'cordova-create': {
      description: 'Apache Cordova creating project...',
      tasks: [
        `${ options.cordova.bin } create ${ options.cordova.folderName || 'hello' } ${ options.cordova.domain || 'com.sample.hello' } ${ options.cordova.winTitle || 'HelloWorld' }`,
        () => {
          return typeof options.params.os === 'string'
            ? `${ options.cordova.bin } platform add ${ options.params.os }`
            : options.params.os.map(item => `${ options.cordova.bin } platform add ${ item }`);
        },
      ],
    },
    'cordova-plugins': {
      description: 'Apache Cordova adding plugins...',
      tasks: [
        () => {
          if (!options.cordova.plugins) return null;
          return typeof options.cordova.plugins === 'string'
            ? `${ options.cordova.bin } plugins add ${ options.cordova.plugins }`
            : options.cordova.plugins.map(item => `${ options.cordova.bin } plugins add ${ item }`);
        },
      ],
    },
    'cordova-config': {
      description: 'Apache Cordova configuring...',
      tasks: [
        {
          deps: {
            path: 'path',
            CordorvaConfTool: './CordorvaConfTool',
            nodes: './',
          },
          func: (CordorvaConfTool, path) => {
            const origin = path.join(
              options.baseDir,
              'builds/native/',
              options.params.env,
              'config.xml'
            );
            const confTool = new CordorvaConfTool(origin, options.cordova.configXmlActions);
            confTool.run();
          },
        },
      ],
    },
    'cordova-build': {
      description: 'Apache Cordova building....',
      tasks: [
        () => {
          return typeof options.cordova.platforms === 'string'
            ? `${ options.cordova.bin } build ${ options.cordova.platforms }`
            : options.cordova.platforms.map(item => `${ options.cordova.bin } build ${ item }`);
        },
      ],
    },
    'build-native-loc': {
      description: 'Building for native...',
      tasks: ['@webpack', '@cordova-create', '@copy-sources', '@cordova-plugins', '@cordova-build'],
    },
  };
};
