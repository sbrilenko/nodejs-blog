var gulp = require('gulp');
var fs = require('fs');
var os = require('os');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var connect = require('gulp-connect');
var htmlmin = require('gulp-htmlmin');
/*gulp_ssh needed for deploy*/
var gulp_ssh = require('gulp-ssh');
var replace = require('gulp-replace');
var crypto = require('crypto');
var sass = require('gulp-sass');

/**
 * constants for dev server
 * url, ports, etc...
 */
const GULP_SERVE_PORT  = '3001';

const DEV_FRONT_PORT = '3001';

const APP_JS_NAME = 'app.js';
const DEPS_JS_NAME = 'vendor.js';

/**
 * update this file
 * if you want to add css
 * file to the project
 */
var list_of_css = [
    'public/stylesheets/scss/style.scss',
];

/**
 * update this list if you want
 * to add dependency to the project
 *
 * order is matter.
 */
var list_of_deps_js = [
    'public/bower_components/angular/angular.min.js',
    'public/bower_components/angular-route/angular-route.min.js',
    'public/bower_components/ng-dialog/js/ngDialog.min.js',
    'public/bower_components/angular-cookies/angular-cookies.min.js',
    'public/bower_components/lodash/dist/lodash.min.js',
    'public/bower_components/restangular/dist/restangular.js',
    'public/bower_components/angular-validation-match/dist/angular-validation-match.js',
    'public/bower_components/moment/moment.js',
    'public/bower_components/angular-moment/angular-moment.js'

];

/* can't test deploy, so i not write this part, but for deploy i use gulp_ssh
* https://www.npmjs.com/package/gulp-ssh
* */
gulp.task('deploy', function(){});


gulp.task('default', ['serve']);

/**
 * concat all css files into one
 */
gulp.task('concat-css', function () {
    gulp.src(list_of_css)
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('styles.css'))
        .pipe(gulp.dest('public/build'));
});

/**
 * concatenate all js files
 * related to our app
 * into one file - APP_JS_NAME
 */
gulp.task('concat-app-js', function () {
    return gulp.src('public/javascripts/**/*.js')
        .pipe(concat(APP_JS_NAME))
        .pipe(gulp.dest('public/build'));
});

/**
 * concatenate all js dependencies
 * of our project into one - DEPS_JS_NAME file
 */
gulp.task('concat-deps-js', function () {
    return gulp.src(list_of_deps_js)
        .pipe(concat(DEPS_JS_NAME))
        .pipe(gulp.dest('public/build'));
});

/**
 * minify APP_JS_NAME
 */
gulp.task('minify-app-js', ['concat-app-js'], function () {
    return gulp.src('public/build/' + APP_JS_NAME)
        .pipe(uglify({
						mangle: false,
						compress: false
				}))
        .pipe(gulp.dest('public/build'));
});

/**
 * minify DEPS_JS_NAME
 */
gulp.task('minify-deps-js', ['concat-deps-js'], function () {
    return gulp.src('public/build/' + DEPS_JS_NAME)
        .pipe(uglify({mangle: false}))
        .pipe(gulp.dest('public/build'))
});

/**
 * run local server for development
 */
gulp.task('serve', ['concat-app-js', 'concat-deps-js', 'html-min', 'concat-css', 'watch-dev-js', 'watch-dev-html', 'watch-dev-css'], function () {
    connect.server({
        port: GULP_SERVE_PORT,
        root: 'public',
        livereload: true
    });
});

/**
 * minify html and save folder structure
 */
gulp.task('html-min', function () {
    return gulp.src(['public/index.html', 'public/404.html', 'public/javascripts/**/*.html'])
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('public/build'))
});

/**
 * watch for app source files
 * and for dependencies and in case of changes
 * run concat tasks
 */
gulp.task('watch-dev-js', function () {
    gulp.watch([
        'public/javascripts/app.modules.js',
        'public/javascripts/app.routes.js',
        'public/javascripts/config.js',
        'public/javascripts/**/*.js'
    ], [
        'concat-app-js',
        'concat-deps-js'
    ]);
});

/**
 * watch for html files.
 * in case of change minify it
 * and put to build folder
 */
gulp.task('watch-dev-html', function () {
    gulp.watch([
        'public/index.html',
				'public/404.html',
        'public/javascripts/**/*.html'
    ], ['html-min'])
});

/**
 * watch for css files
 * in case of change concat it with
 * all other css files and put into build folder
 */
gulp.task('watch-dev-css', function () {
    gulp.watch(list_of_css, ['concat-css'])
});
