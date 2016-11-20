'use strict';

const path = require('path');
const webpackConfig = require('./webpack.conf');

/**
 * @param {Object} options
 * @param {Array.<String>} options.files Paths to test files.
 * @param {Boolean} options.coverage Whether to generate the code coverage report.
 * @param {Boolean} options.verbose Whether to show Webpack logs.
 * @param {Boolean} options.sourceMap Whether to generate the source maps.
 * @param {Boolean} options.watch Whether to watch the files.
 * @returns {Object}
 */
module.exports = (options) => {
    const karmaConfig = {
        frameworks: ['mocha', 'chai', 'sinon'],

        files: options.files.map((file) => {
            return {
                pattern: file,
                watched: false,
                included: true,
                served: true
            };
        }),

        exclude: [
            path.join('tests', 'engine', 'filters', '_html', '**', '*.js')
        ],

        preprocessors: {
            'src/**/*.js': ['webpack'],
            'tests/**/*.js': ['webpack']
        },

        webpack: webpackConfig({
            coverage: options.coverage,
            sourceMap: options.sourceMap,
            saveFiles: false,
            watch: false
        }),

        webpackMiddleware: {
            noInfo: true,
            stats: {
                chunks: false
            }
        },

        reporters: ['mocha'],

        port: 9876,

        colors: true,

        logLevel: 'INFO',

        browsers: ['Chrome'],

        customLaunchers: {
            CHROME_TRAVIS_CI: {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        },

        singleRun: true,

        concurrency: Infinity,

        browserNoActivityTimeout: 0
    };

    if (options.coverage) {
        karmaConfig.reporters.push('coverage');

        karmaConfig.coverageReporter = {
            dir: '.coverage',
            reporters: [
                {type: 'html'},
                {type: 'text-summary'},
                {type: 'lcovonly'}
            ]
        };
    }

    if (options.watch) {
        karmaConfig.autoWatch = true;
        karmaConfig.singleRun = false;
    }

    if (options.verbose) {
        karmaConfig.webpackMiddleware.noInfo = false;
        delete karmaConfig.webpackMiddleware.stats;
    }

    return karmaConfig;
};
