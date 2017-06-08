const os = require('os');
const path = require('path');

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
        () =>
          os.platform() === 'win32'
            ? `rmdir /S/Q "${ options.sources.dest }"`
            : `rm -rf "${ options.sources.dest }"`,
        () =>
          os.platform() === 'win32'
            ? `xcopy "${ options.sources.source }" "${ options.sources.dest }"`
            : `cp -rf "${ options.sources.source }" "${ options.sources.dest }"`,
      ],
    },
    'cordova-create': {
      description: 'Apache Cordova creating project...',
      tasks: [
        `dir ${ options.cordova.buildPath }`,
        () =>
          os.platform() === 'win32'
            ? `rmdir /S/Q "${ options.cordova.buildPath }"`
            : `rm -rf "${ options.cordova.buildPath }"`,
        `mkdir "${ options.cordova.buildPath }"`,
        `${ options.cordova.bin } create ${ path.join(
          options.cordova.buildPath,
          options.cordova.folderName || 'hello'
        ) } ${ options.cordova.domain || 'com.sample.hello' } ${ options.cordova.winTitle ||
          'HelloWorld' }`,
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
          return !Array.isArray(options.cordova.plugins)
            ? `${ options.cordova.bin } plugins add ${ options.cordova.plugins }`
            : options.cordova.plugins.map(item => `${ options.cordova.bin } plugins add ${ item }`);
        },
      ],
    },
    'cordova-config': {
      description: 'Apache Cordova configuring...',
      tasks: [
        () => {
          const path = require('path');
          const CordorvaConfTool = require('./CordorvaConfTool');

          const origin = path.join(
            `${ options.baseDir }`,
            'builds/native/',
            `${ options.params.env }`,
            'config.xml'
          );
          const confTool = new CordorvaConfTool(origin, `${ options.cordova.configXmlActions }`);
          confTool.run();
        },
      ],
    },
    'cordova-build': {
      description: 'Apache Cordova building....',
      tasks: [
        () => {
          return !Array.isArray(options.cordova.platforms)
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
