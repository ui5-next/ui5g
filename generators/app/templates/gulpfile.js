var gulp = require('gulp');
var connect = require('gulp-connect');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var proxyMiddleware = require('./proxies');
var runSequence = require("run-sequence");
var eslint = require('gulp-eslint');
var less = require('gulp-less');
var del = require('del');

var SRC_ROOT = "./webapp";
var DEST_ROOT = "./dist";

gulp.task('default', () => {
  runSequence(['build-js', 'less'], 'copy', 'copy-lib', 'connect', 'watch');
});

gulp.task('build', () => {
  runSequence('clean', 'lint', ['build-js', 'less'], 'copy', 'copy-lib');
});

gulp.task('clean', () => {
  del(DEST_ROOT);
});

gulp.task('connect', () => {
  connect.server({
    root: `${DEST_ROOT}`,
    port: 8080,
    livereload: true,
    middleware: proxyMiddleware
  });
});

// run gulp lint to auto fix src directory
gulp.task('lint', () => {
  return gulp.src([`${SRC_ROOT}/**/*.js`, '!node_modules/**'])
    .pipe(eslint({ fix: true, useEslintrc: true }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(gulp.dest(SRC_ROOT));
});


gulp.task('watch', () => {
  gulp.watch(`${SRC_ROOT}/**/*`, cb => {
    runSequence(["build-js", "less"], "copy", "copy-lib", "reload");
  });
});

gulp.task('reload', () => {
  gulp.src(`${DEST_ROOT}/**/*`)
    .pipe(connect.reload());
});


gulp.task("build-js", () => {
  gulp.src([`${SRC_ROOT}/**/*.js`, `!${SRC_ROOT}/lib/*.js`])
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(`${DEST_ROOT}`));
});

gulp.task('less', () => {
  gulp.src(`${SRC_ROOT}/css/*.less`, { base: `${SRC_ROOT}` })
    .pipe(less())
    .pipe(gulp.dest(`${DEST_ROOT}`));
});

gulp.task("copy", () => {
  gulp.src([`${SRC_ROOT}/**/*`, `!${SRC_ROOT}/**/*.js`, `!${SRC_ROOT}/**/*.less`], { base: `${SRC_ROOT}` })
    .pipe(gulp.dest(`${DEST_ROOT}`));
});

gulp.task("copy-lib", () => {
  gulp.src(`${SRC_ROOT}/lib/*.js`, { base: `${SRC_ROOT}` })
    .pipe(gulp.dest(`${DEST_ROOT}`));
});