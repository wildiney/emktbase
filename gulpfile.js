const { src, dest, series, watch, parallel, task } = require('gulp');

const gulp = require('gulp');
const notify = require('gulp-notify');
const strip = require('gulp-strip-comments');
const htmlmin = require('gulp-htmlmin');
const inlineCSS = require('gulp-inline-css');
const imagemin = require('gulp-imagemin');
const browsersync = require('browser-sync').create();
const sass = require('gulp-sass');
const plumber = require('gulp-plumber'); //Prevent pipe breaking caused by errors from gulp plugins


const dist = {
  html: ['./dist/'],
  images: ['./dist/images/']
};

const source = {
  html: ['./src/*.html'],
  scss: ['./src/scss/**/*.scss'],
  cssFolder: ['./src/css/'],
  cssFiles: ['./src/css/**/*.css'],
  images: ['./src/images/*']
};

const syncOpts = {
  server: {
    baseDir: dist.html
  },
  port: 3030,
  open: true,
  notify: true,
  // if not windows use 'google chrome'
  browser: ['chrome.exe']
};

function browserSync(){
  browsersync.init(syncOpts);
}

const browserSyncReload = () => {
  browsersync.reload();
}

function scss() {
  return gulp.src('src/scss/*.scss')
    .pipe(plumber())
    .pipe(sass({ outputStyle: "expanded" }))
    .pipe(gulp.dest(source.cssFolder))
    .pipe(browsersync.stream())
    .pipe(notify("SCSS Finished"));
}

function css(){
  return gulp.src('src/*.html')
    .pipe(inlineCSS({
      applyStyleTags: true,
      applyLinkTags: true,
      removeStyleTags: true,
      removeLinkTags: true
    }))
    .pipe(gulp.dest('dist/'))
    .pipe(browsersync.stream())
    .pipe(notify("CSS Finished"));
}

function html(){
  return gulp.src('dist/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist/'))
    .pipe(browsersync.stream())
    .pipe(notify("HTML Finished"));
}

function optimizeImage() {
  return gulp.src(source.images)
    .pipe(imagemin())
    .pipe(gulp.dest(dist.images))
    .pipe(browsersync.reload({ stream: true }));
}

function watchFiles(){
  gulp.watch('src/scss/*.scss', gulp.parallel(gulp.series(scss, css, html))).on('change', browsersync.reload);
  //watch(source.html, minifyHTML).on('change', browserSyncReload);
}

const watcher = gulp.parallel(watchFiles, browserSync);
const build = gulp.parallel(scss, css, html, optimizeImage)

//gulp.task('default', gulp.series(scss, css, html));

exports.watch = watcher;
exports.build = build;
exports.default = build;
