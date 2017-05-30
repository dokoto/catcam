module.exports = function (options) {
  return {
    'webpack': {
      model: {
        name: 'Webpack: packing...',
      },
      tasks: [
        `node ${ options.webpack.bin } --config ${ options.webpack.config } --progress --profile --colors --env.target='${ options.params.target }' --env.env='${ options.params.env }' --env.platform='${ options.params.platform }' --env.version='${ options.params.version }' --env.languaje='${ options.params.languaje }'`,
      ],
    },
    'build-native-loc': {
      model: {
        name: 'Building for web',
        extends: ['webpack'],
      },
      tasks: [],
    },
  };
};
