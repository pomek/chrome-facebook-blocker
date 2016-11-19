'use strict';

const path = require('path');

/**
 * @param {Object} options
 * @param {Boolean} options.saveFiles Whether to save compiled files.
 * @param {Boolean} options.coverage Whether to generate the code coverage report.
 * @param {Boolean} options.sourceMap Whether to generate the source maps.
 * @param {Boolean} options.watch Whether to watch the files.
 * @returns {Object}
 */
module.exports = (options) => {
    const webpackConfig = {
        module: {
            preLoaders: [
                {
                    test: /\.js$/,
                    exclude: /(node_modules)/,
                    loader: 'babel',
                    query: {
                        cacheDirectory: true,
                        plugins: ['transform-es2015-modules-commonjs']
                    }
                }
            ]
        },

        watch: options.watch,

        plugins: []
    };

    if (options.saveFiles) {
        webpackConfig.output = {
            filename: "[name].js"
        }
    }

    if (options.coverage) {
        webpackConfig.module.preLoaders.push({
            test: /\.js$/,
            loader: 'istanbul-instrumenter',
            include: path.resolve('src/'),
            exclude: [
                /(node_modules)/,
                /tests/
            ],
            query: {
                esModules: true
            }
        });
    }

    if (options.sourceMap) {
        webpackConfig.devtool = 'inline-source-map';
    }

    return webpackConfig;
};
