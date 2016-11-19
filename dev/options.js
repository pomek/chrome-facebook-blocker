'use strict';

const minimist = require('minimist');

const options = minimist(process.argv.slice(2), {
    string: [
        'files'
    ],

    boolean: [
        'watch',
        'coverage',
        'source-map',
        'verbose',
    ],

    alias: {
        w: 'watch',
        c: 'coverage',
        s: 'source-map',
        v: 'verbose',
    },

    default: {
        files: 'tests/**/*.js',
        watch: false,
        coverage: false,
        verbose: false,
        'source-map': false,
    }
});

options.sourceMap = options['source-map'];
options.files = options.files.split(',');

module.exports = options;
