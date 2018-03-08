'use strict';

var gulp = require('gulp');
var strip = require('gulp-strip-comments');
var inlineCSS = require('gulp-inline-css');
var htmlmin = require('gulp-htmlmin');
var imagemin = require('gulp-imagemin');
var browserSync = require('browser-sync').create();
var os = require('os');
var open = require('gulp-open');
var browser = os.platform() === 'linux' ? 'google-chrome' : (os.platform() === 'darwin' ? 'google chrome' : (os.platform() === 'win32' ? 'chrome' : 'firefox'));

function exec_inlineCSS_minify() {
    return gulp.src('./src/*.html')
        .pipe(strip())
        .pipe(inlineCSS())
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('./dist/'))
        .pipe(browserSync.reload({
            stream: true
        }));
}
function exec_imagemin() {
    return gulp.src('./src/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/img/'))
        .pipe(browserSync.reload({
            stream: true
        }));
}
function exec_browserSync(done) {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
    done();
}
function exec_open() {
    var options = {
        uri: 'localhost:3000',
        app: 'firefox'
    };
    gulp.src(__filename)
        .pipe(open(options));
}
gulp.task('html', exec_inlineCSS_minify);
gulp.task('imagemin', exec_imagemin);
gulp.task('browserSync', exec_browserSync);
gulp.task('open', exec_open);


var watcher = gulp.watch('./src/**/*', gulp.series('html', 'imagemin'));
watcher.on('change', browserSync.reload)

gulp.task('default', gulp.series('html', 'browserSync', 'open'));
