'use strict';

const gulp = require('gulp');
const eslint = require('gulp-eslint');
const zip = require('gulp-zip');
const named = require('vinyl-named');
const webpack = require('webpack-stream');
const KarmaServer = require('karma').Server;
const streamToPromise = require('gulp-stream-to-promise');
const options = require('./dev/options');
const slug = require('slug');
const del = require('del');

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

gulp.task('clean', () => {
    return del('./.build');
});

gulp.task('pre-build', ['clean', 'compile'], () => {
    const streams = [
        gulp.src('assets/icon_*.png').pipe(gulp.dest('./.build/assets')),
        gulp.src('views/*.html').pipe(gulp.dest('./.build/views')),
        gulp.src('dist/*.js').pipe(gulp.dest('./.build/dist')),
        gulp.src('manifest.json').pipe(gulp.dest('./.build')),
    ];

    return Promise.all(streams.map((s) => streamToPromise(s)));
});

gulp.task('build', ['pre-build'], function () {
    const manifest = require('./manifest.json');
    const distFileName = slug(manifest.name) + '_v' + manifest.version + '.zip';

    return gulp.src('.build/**/*')
        .pipe(zip(distFileName))
        .pipe(gulp.dest('.build'));
});
