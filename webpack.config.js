var path = require('path')
var pkg = require('./package.json')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var version = pkg.version

var config = {
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'build.js'
  },
    entry: {
         example: './test.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            // https://github.com/jantimon/html-webpack-plugin
            title: 'min-promise ' + version,
            filename: 'index.html'
        })
    ],
    module: {
        loaders: [
        ]
    },
    devtool: '#cheap-module-eval-source-map'
}

if (process.env.NODE_ENV !== 'development') {
    config.devtool = 'cheap-module-source-map'
    config.output.filename = ['[name]', '[hash]'].join('_') + '.js'
}

module.exports = config
