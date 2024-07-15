const gulp = require('gulp');
const gulpPug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const rename = require('gulp-rename');
const concat = require('gulp-concat-css');
const del = require('del');
const browserSync = require('browser-sync').create();
const postcss = require('gulp-postcss');
const mediaquery = require('postcss-combine-media-query');

function serve() {
  browserSync.init({
    server: { baseDir: '.' },
  });
}

function pug() {
  return gulp
    .src('pages/*.pug')
    .pipe(gulpPug({ pretty: true }))
    .pipe(
      rename(path => {
        path.dirname = '.';

        return path;
      }),
    )
    .pipe(gulp.dest('.', { overwrite: true }))
    .pipe(browserSync.reload({ stream: true }));
}

function scss() {
  return gulp.src('blocks/**/*.scss')
    .pipe(sass())
    .pipe(concat('style.css'))
    .pipe(postcss([mediaquery()]))
    .pipe(gulp.dest('styles/'), { overwrite: true })
    .pipe(browserSync.reload({ stream: true }));
}

function clean() {
  return del(['styles/style.css', '*.html']);
}

function watchFiles() {
  gulp.watch(['blocks/**/*.pug', 'pages/*.pug', 'layouts/*.pug'], pug);
  gulp.watch(['blocks/**/*.scss'], scss);
}

const build = gulp.series(clean, gulp.parallel(pug, scss));
const watchapp = gulp.parallel(build, watchFiles, serve);

exports.pug = pug;
exports.scss = scss;
exports.clean = clean;

exports.build = build;
exports.watchapp = watchapp;
exports.default = watchapp;
