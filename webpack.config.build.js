const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const webpackConfig = require('./webpack.config');

const dirAssets = path.join(__dirname, 'assets');
const webManifest = path.join(__dirname, 'manifest.json');

module.exports = merge(webpackConfig, {

    devtool: 'source-map',

    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].[chunkhash].js'
    },

    plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin([
            { 
				from: dirAssets,
				to: path.resolve(__dirname, 'dist', 'assets'),
            },
            { 
				from: webManifest,
				to: path.resolve(__dirname, 'dist'),
			}
		]),
    ]

});
