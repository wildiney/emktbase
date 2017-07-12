'use strict';

var gulp            = require('gulp');
var inlineCss       = require('gulp-inline-css');
var strip           = require('gulp-strip-comments');
var htmlmin         = require('gulp-htmlmin');
var imagemin        = require('gulp-imagemin');
var browserSync     = require('browser-sync').create();
var os              = require('os');
var open            = require('gulp-open');
var browser         = os.platform() === 'linux' ? 'google-chrome' : (os.platform() === 'darwin' ? 'google chrome' : ( os.platform() === 'win32' ? 'chrome' : 'firefox'));

gulp.task('html',['imagemin'], function () {
    return gulp.src('./src/*.html')
        .pipe(strip())
        .pipe(inlineCss())
        .pipe(htmlmin({collapseWhitespace:true}))
        .pipe(gulp.dest('./dist/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('open', function(){
    var options = {
        uri:'localhost:3000',
        app: 'firefox'
    };
    gulp.src(__filename)
    .pipe(open(options));
})

gulp.task('imagemin',function(){
    return gulp.src('./src/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/img/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('browserSync', ['html'], function () {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
});

gulp.task('watch', ['browserSync'], function(){
    gulp.watch("./src/*.html",['html']);
    gulp.watch("./src/img/*",['imagemin']);
});

gulp.task('default', ['html', 'browserSync','imagemin','open','watch']);
