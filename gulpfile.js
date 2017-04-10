var gulp = require('gulp');
var inlineCss = require('gulp-inline-css');
var strip = require('gulp-strip-comments');
var htmlmin = require('gulp-htmlmin');
var imagemin = require('gulp-imagemin');
var browserSync = require('browser-sync').create();

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

gulp.task('default', ['html', 'browserSync','imagemin','watch']);
