"use strict";

const { src, dest, series, watch, parallel } = require("gulp");
const del = require("del");
const notify = require("gulp-notify");
const strip = require("gulp-strip-comments");
const htmlmin = require("gulp-htmlmin");
const inlineCSS = require("gulp-inline-css");
const imagemin = require("gulp-imagemin");
const browsersync = require("browser-sync").create();
const sass = require("gulp-sass");
const plumber = require("gulp-plumber"); //Prevent pipe breaking caused by errors from gulp plugins

const path = {
  files: {
    src: {
      html: "./src/*.html",
      scss: "./src/scss/*.scss",
      images: "./src/images/*"
    },
    dist: {
      html: "./dist/*.html"
    }
  },
  folder: {
    src: {
      html: "./src/",
      scss: "./src/scss/",
      css: "./src/css/"
    },
    dist: {
      html: "./dist/",
      images: "./dist/images/"
    }
  }
};
const syncOpts = {
  server: {
    baseDir: path.folder.dist.html
  },
  port: 3030,
  notify: true
};
function browserSync(done) {
  browsersync.init(syncOpts);
  done();
}
function browserSyncReload(){
  browsersync.reload();
};
function clean(done){
  del.sync('dist/**');
  done();
}
function scss() {
  return src(path.files.src.scss)
    .pipe(plumber())
    .pipe(sass({ outputStyle: "expanded" }))
    .pipe(dest(path.folder.src.css))
    .pipe(browsersync.stream())
    .pipe(notify("SCSS Finished"));
}
function css() {
  return src(path.files.src.html)
    .pipe(
      inlineCSS({
        applyStyleTags: true,
        applyLinkTags: true,
        removeStyleTags: true,
        removeLinkTags: true
      })
    )
    .pipe(dest(path.folder.dist.html))
    .pipe(browsersync.stream())
    .pipe(notify("CSS Finished"));
}
function html() {
  return src(path.files.dist.html)
    .pipe(strip())
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest(path.folder.dist.html))
    .pipe(browsersync.stream())
    .pipe(notify("HTML Finished"));
}
function optimizeImage() {
  return src(path.files.src.images)
    .pipe(imagemin())
    .pipe(dest(path.folder.dist.images))
    .pipe(browsersync.reload({ stream: true }));
}
function watchFiles() {
  watch([path.files.src.scss, path.files.src.html], series(scss, css, html)).on(
    "change",
    browserSyncReload
  );
}

const build = series(clean, parallel(scss, css, html, optimizeImage));
const watcher = series(build, parallel(watchFiles, browserSync));

exports.scss = scss;
exports.css = css;
exports.html = html;
exports.clean = clean;

exports.watch = watcher;
exports.build = build;
exports.default = build;
