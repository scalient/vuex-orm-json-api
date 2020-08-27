const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: {
    'index': path.resolve(__dirname, 'src/index.js'),
    'index.min': path.resolve(__dirname, 'src/index.js'),
  },
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    library: 'vuex-orm-json-api',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    minimizer: [new TerserPlugin({
      sourceMap: true,
      include: /\.min\.js$/,
    })],
  },
};
