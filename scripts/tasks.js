module.exports = function (options) {
  return {
    webpack: {
      description: 'Webpack: packing...',
      tasks: [
        `node ${ options.webpack.bin } --config ${ options.webpack.config } --progress --profile --colors --env.target='${ options.params.target }' --env.env='${ options.params.env }' --env.platform='${ options.params.platform }' --env.version='${ options.params.version }' --env.languaje='${ options.params.languaje }'`,
      ],
    },
    'copy-sources': {
      description: 'Coping sources...',
      tasks: [
        {
          define: {
            fs: 'fs-extra',
          },
          func: fs => {
            fs.removeSync(options['copy-sources'].dest);
            fs.copySync(options.['copy-sources'].source, options.['copy-sources'].dest);
          },
        },
      ],
    },
    'cordova-build': {
      description: 'Apache Cordova building....',
    },
    'build-native-loc': {
      description: 'Building for native...',
      tasks: ['@webpack', '@cordova-build', '@copy-sources'],
    },
  };
};
