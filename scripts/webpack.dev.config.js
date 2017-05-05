

const webpack = require('webpack');
const path = require('path');

const DashboardPlugin = require('webpack-dashboard/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

const jsSourcePath = path.join(__dirname, '../app/src');
const buildPath = path.join(__dirname, '../build');
const imgPath = path.join(__dirname, '../app/assets/img');
const sourcePath = path.join(__dirname, '../app');

module.exports = env => {
  console.log('ENVIRONMENT VARS %s', JSON.stringify(env));
  const isProduction = env.target === 'prod';

  // Common plugins
  const plugins = [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor-[hash].js',
      minChunks(module) {
        const context = module.context;
        return context && context.indexOf('node_modules') >= 0;
      },
    }),
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(jsSourcePath, 'index.html'),
      path: buildPath,
      filename: 'index.html',
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [
          autoprefixer({
            browsers: ['last 3 version', 'ie >= 10'],
          }),
        ],
        context: sourcePath,
      },
    }),
    new webpack.DefinePlugin({
      TARGET: JSON.stringify(env.target),
      PLATFORM: JSON.stringify(env.platform),
      VERSION: JSON.stringify(env.version),
    }),
  ];

  // Common rules
  const rules = [
    {
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: ['babel-loader'],
    },
    {
      test: /\.(png|gif|jpg|svg)$/,
      include: imgPath,
      use: 'url-loader?limit=20480&name=assets/[name]-[hash].[ext]',
    },
  ];

  if (isProduction) {
    // Production plugins
    plugins.push(
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false,
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
          screw_ie8: true,
          conditionals: true,
          unused: true,
          comparisons: true,
          sequences: true,
          dead_code: true,
          evaluate: true,
          if_return: true,
          join_vars: true,
        },
        output: {
          comments: false,
        },
      }),
      new ExtractTextPlugin('style-[hash].css')
    );

    // Production rules
    rules.push({
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: 'css-loader!postcss-loader!sass-loader',
      }),
    });
  } else {
    // Development plugins
    plugins.push(new webpack.HotModuleReplacementPlugin(), new DashboardPlugin());

    // Development rules
    rules.push({
      test: /\.scss$/,
      exclude: /node_modules/,
      use: [
        'style-loader',
        // Using source maps breaks urls in the CSS loader
        // https://github.com/webpack/css-loader/issues/232
        // This comment solves it, but breaks testing from a local network
        // https://github.com/webpack/css-loader/issues/232#issuecomment-240449998
        // 'css-loader?sourceMap',
        'css-loader',
        'postcss-loader',
        'sass-loader?sourceMap',
      ],
    });
  }

  let webPackConf = {
    devtool: isProduction ? false : 'source-map',
    context: jsSourcePath,
    entry: {
      js: 'app.js',
    },
    output: {
      path: buildPath,
      publicPath: '/',
      filename: 'app-[hash].js',
    },
    module: {
      rules,
    },
    resolve: {
      extensions: ['.webpack-loader.js', '.web-loader.js', '.loader.js', '.js', '.jsx'],
      modules: ['node_modules', jsSourcePath],
    },
    plugins,
    devServer: {
      contentBase: isProduction ? '../build' : '../app',
      historyApiFallback: true,
      port: 3000,
      compress: isProduction,
      inline: !isProduction,
      hot: !isProduction,
      host: '0.0.0.0',
      stats: {
        assets: true,
        children: false,
        chunks: false,
        hash: false,
        modules: false,
        publicPath: false,
        timings: true,
        version: false,
        warnings: true,
        colors: {
          green: '\u001b[32m',
        },
      },
    },
  };

  return webPackConf;
};
