'use strict';

const gulp = require('gulp');
const eslint = require('gulp-eslint');
const named = require('vinyl-named');
const webpack = require('webpack-stream');
const KarmaServer = require('karma').Server;
const options = require('./dev/options');

gulp.task('compile', () => {
    const webpackConfig = require('./dev/webpack.conf')({
        watch: options.watch,
        sourceMap: options.sourceMap,
        coverage: false,
        saveFiles: true
    });

    return gulp.src(['./src/script.js', './src/settings.js'])
        .pipe(named())
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest('./dist'));
});

gulp.task('test', (done) => {
    const karmaConfig = require('./dev/karma.conf')({
        files: options.files,
        coverage: options.coverage,
        verbose: options.verbose,
        watch: options.watch,
        sourceMap: options.sourceMap
    });

    new KarmaServer(karmaConfig, done).start();
});

gulp.task('lint', () => {
    return gulp.src(['**/*.js', '!node_modules/**', '!dist/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});
