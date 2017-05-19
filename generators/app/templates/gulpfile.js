var gulp = require('gulp');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var runSequence = require("run-sequence");
var eslint = require('gulp-eslint');
var merge = require('merge-stream');
var browserSync = require("browser-sync");
var GulpMem = require('gulp-mem');
var less = require('gulp-less');
var del = require('del');

var SRC_ROOT = "./webapp";
var DEST_ROOT = "./dist";


var gulpMem = new GulpMem();
gulpMem.serveBasePath = DEST_ROOT;
gulpMem.enableLog = false;


var buildJs = () => {
  return gulp.src([`${SRC_ROOT}/**/*.js`, `!${SRC_ROOT}/lib/*.js`])
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.'));
};

var buildCss = () => {
  return gulp.src(`${SRC_ROOT}/css/*.less`, { base: `${SRC_ROOT}` })
    .pipe(less());
};

var copy = () => {
  return gulp.src([`${SRC_ROOT}/**/*`, `!${SRC_ROOT}/**/*.less`], { base: `${SRC_ROOT}` });
};

var build = () => {
  return merge(copy(), buildJs(), buildCss());
};


gulp.task('default', () => {
  runSequence('build:mem', 'bs', 'watch');
});

gulp.task('build:mem', () => {
  return build()
    .pipe(gulpMem.dest(DEST_ROOT));
});

gulp.task('build', () => {
  return build().
    pipe(gulp.dest(DEST_ROOT));
});

gulp.task('clean', () => {
  del(DEST_ROOT);
});

gulp.task('bs', () => {
  var middlewares = require('./proxies');
  middlewares.push(gulpMem.middleware);
  browserSync.init({
    server: {
      baseDir: DEST_ROOT,
      middleware: middlewares
    }
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
  gulp.watch(`${SRC_ROOT}/**/*`, ['reload']);
});

gulp.task('reload', ['build:mem'], browserSync.reload);

gulp.task("build-js", buildJs);

gulp.task('build-css', buildCss);

gulp.task("copy", copy);