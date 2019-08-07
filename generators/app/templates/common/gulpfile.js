var gulp = require("gulp");
var babel = require("gulp-babel");
var sourcemaps = require("gulp-sourcemaps");
var eslint = require("gulp-eslint");
var merge = require("merge-stream");
var browserSync = require("browser-sync");
var less = require("gulp-less");
var del = require("del");
var filter = require("gulp-filter");
var console = require("console");
var eagerPreload = require("gulp-ui5-eager-preload");
var ui5preload = eagerPreload.componentPreload;
var additionalPreload = require("./ui5Preload");
var { join } = require("path");

var babelConfig = require("./.babelrc");

var packageJson = require("./package.json");

var SRC_ROOT = "./src";
var DEST_ROOT = "./dist";
var APP_NAME = packageJson.name;
var namespace = packageJson.app.namespace;
var resourceRoot = packageJson.app.resource;

var buildJs = ({ sourcemap }) => {
  // use to avoid an error cause whole gulp failed
  var b = babel(babelConfig).on("error", e => {
    console.log(e.stack);
    b.end();
  });
  var rt = gulp.src([`${SRC_ROOT}/**/*.js`, `!${SRC_ROOT}/**/lib/*.js`]);
  if (sourcemap) {
    rt = rt.pipe(sourcemaps.init());
  }
  rt = rt.pipe(b);
  if (sourcemap) {
    rt = rt.pipe(sourcemaps.write({ sourceRoot: "/sourcemaps" }));
  }
  return rt;
};

var buildCss = () => {
  return gulp
    .src(`${SRC_ROOT}/**/css/*.less`, { base: `${SRC_ROOT}` })
    .pipe(less());
};

var copy = ({ preload = false, offline = false }) => {
  return merge(
    gulp.src(
      [
        `${SRC_ROOT}/**/*`,
        `!${SRC_ROOT}/**/*.js`,
        `!${SRC_ROOT}/index.html`,
        `!${SRC_ROOT}/**/*.less`
      ],
      { base: `${SRC_ROOT}` }
    ),
    gulp.src([`${SRC_ROOT}/**/lib/*`], { base: `${SRC_ROOT}` }),
    gulp.src("./package.json").pipe(
      eagerPreload({
        title: APP_NAME,
        theme: "sap_belize",
        bootScriptPath: "./index.js",
        ui5ResourceRoot: resourceRoot,
        preload,
        offline,
        sourceDir: join(__dirname, "./src"),
        thirdpartyLibPath: "_thirdparty",
        projectNameSpace: namespace,
        additionalResources: additionalPreload.additionalResources,
        additionalModules: additionalPreload.additionalModules
      })
    )
  );
};

var build = ({ preload = false, sourcemap = false, offline = false }) => {
  var tasks = merge(copy({ preload, offline }), buildJs({ sourcemap }), buildCss());
  if (preload) {
    return tasks
      .pipe(gulp.dest(DEST_ROOT))
      .pipe(
        filter([
          "**/*.js",
          "**/*.xml",
          "**/*.properties",
          "**/*.json",
          // remove offline files
          "!**/resources/**/*.*",
          // avoid preload file
          "!**/preload.js",
          // not use now
          "!**/lib/*"
        ])
      )
      .pipe(ui5preload({ base: `${DEST_ROOT}`, namespace }));
  } else {
    return tasks;
  }
};

gulp.task("clean", () => del(DEST_ROOT));

gulp.task("build:preload", () => {
  return build({ preload: true, sourcemap: true, offline: false }).pipe(gulp.dest(DEST_ROOT));
});

gulp.task("build:debug", () => {
  return build({ preload: false, sourcemap: true, offline: false }).pipe(gulp.dest(DEST_ROOT));
});

gulp.task("build", () => {
  return build({ preload: true, sourcemap: false, offline: false }).pipe(gulp.dest(DEST_ROOT));
});

gulp.task("bs", () => {
  var middlewares = require("./proxies");
  browserSync.init({
    server: {
      baseDir: DEST_ROOT,
      middleware: middlewares
    },
    reloadDelay: 1 * 1000,
    reloadDebounce: 1 * 1000,
    notify: false,
    startPath: "/"
  });
});

gulp.task("bs:silent", () => {
  var middlewares = require("./proxies");
  browserSync.init({
    server: {
      baseDir: DEST_ROOT,
      middleware: middlewares
    },
    open: false,
    reloadDelay: 1 * 1000,
    reloadDebounce: 1 * 1000,
    notify: false,
    startPath: "/"
  });
});

// run gulp lint to auto fix src directory
gulp.task("lint", () => {
  return gulp
    .src([`${SRC_ROOT}/**/*.js`, "!node_modules/**"])
    .pipe(eslint({ fix: true, useEslintrc: true }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(gulp.dest(SRC_ROOT));
});

gulp.task("watch", () => {
  gulp.watch(`${SRC_ROOT}/**/*`, gulp.series(["build", "reload"]));
});

gulp.task("watch:debug", () => {
  gulp.watch(`${SRC_ROOT}/**/*`, gulp.series(["build:debug", "reload"]));
});

gulp.task("watch:preload", () => {
  gulp.watch(`${SRC_ROOT}/**/*`, gulp.series(["build:preload", "reload"]));
});

gulp.task("live-build", gulp.series("build", "bs"), () => {
  gulp.watch(`${SRC_ROOT}/**/*`, () => gulp.series("build", "reload"));
});

gulp.task("reload", done => {
  browserSync.reload();
  done();
});

gulp.task("build-js", buildJs);

gulp.task("build-css", buildCss);

gulp.task("copy", copy);

gulp.task("dev", gulp.series("clean", "build:debug", gulp.parallel("bs", "watch:debug")));

gulp.task("dev:preload", gulp.series("clean", "build:preload", gulp.parallel("bs", "watch:preload")));

gulp.task("dev:silent", gulp.series("clean", "build:preload", gulp.parallel("bs:silent", "watch:preload")));
