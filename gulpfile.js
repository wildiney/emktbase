const { src, dest, series, watch } = require('gulp');
const strip = require('gulp-strip-comments');
const htmlmin = require('gulp-htmlmin');
const inlineCSS = require('gulp-inline-css');
const imagemin = require('gulp-imagemin');
const browsersync = require('browser-sync').create();

const dist = {
  html: ['./dist/'],
  images: ['./dist/images/']
};
const source = {
  html: ['./src/*.html'],
  images: ['./src/images/*']
};
const syncOpts = {
  server: {
    baseDir: dist.html,
    index: 'index.html'
  },
  open: true,
  notify: true,
  browser: 'google chrome'
};

function minifyHTML() {
  return src(source.html)
    .pipe(strip())
    .pipe(
      inlineCSS({
        applyStyleTags: true,
        apllyLinkTags: true,
        removeStyleTags: true,
        removeLinkTags: true
      })
    )
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest(dist.html));
}

function optimizeImage() {
  return src(source.images)
    .pipe(imagemin())
    .pipe(dest(dist.images))
    .pipe(browserSync.reload({ stream: true }));
}

function bSync(cb) {
  browsersync.init(syncOpts);
  const watcher = watch(source.html);
  watcher.on('change', browsersync.reload);
  watch(source.html, optimizeImage);
  watch(source.html, minifyHTML);
  cb();
}

exports.default = series(minifyHTML, optimizeImage, bSync);
