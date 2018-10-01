const merge = require('webpack-merge');
const webpackConfig = require('./webpack.config');

module.exports = merge(webpackConfig, {

    devtool: 'inline-source-map',

    optimization:{
        minimize: false, // <---- disables uglify.
        // minimizer: [new UglifyJsPlugin()] if you want to customize it.
    },

    output: {
        pathinfo: true,
        publicPath: '/',
        filename: '[name].js'
    }

});
