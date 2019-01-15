var gulp = require("gulp");
var babel = require("gulp-babel");
var sourcemaps = require("gulp-sourcemaps");
var ui5preload = require("gulp-ui5-preload");
var eslint = require("gulp-eslint");
var merge = require("merge-stream");
var browserSync = require("browser-sync");
var GulpMem = require("gulp-mem");
var less = require("gulp-less");
var del = require("del");
var filter = require("gulp-filter");
var console = require("console");
var eagerPreload = require("gulp-ui5-eager-preload");
var { join } = require("path");

var SRC_ROOT = "./src";
var DEST_ROOT = "./dist";
var namespace = "<%= namespace %>";
var resourceRoot = "https://<%= ui5Domain %>/resources/";

var gulpMem = new GulpMem();
gulpMem.serveBasePath = DEST_ROOT;
gulpMem.enableLog = false;

var buildJs = () => {
  // use to avoid an error cause whole gulp failed
  var b = babel().on("error", e => {
    console.log(e.stack);
    b.end();
  });
  return gulp
    .src([`${SRC_ROOT}/**/*.js`, `!${SRC_ROOT}/**/lib/*.js`])
    .pipe(sourcemaps.init())
    .pipe(b)
    .pipe(sourcemaps.write("/sourcemap"));
};

var buildCss = () => {
  return gulp
    .src(`${SRC_ROOT}/**/css/*.less`, { base: `${SRC_ROOT}` })
    .pipe(less());
};

var copy = ({ preload = false }) => {
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
        ui5ResourceRoot: resourceRoot,
        preload,
        sourceDir: join(__dirname, "./src"),
        thirdpartyLibPath: "_thridparty",
        projectNameSpace: namespace,
        addtionalResources: [
          "sap/m/messagebundle_zh_CN.properties",
          "sap/ui/core/messagebundle_zh_CN.properties"
        ],
        title: "ui5-workthrough",
        theme: "sap_belize",
        bootScriptPath: "./index.js",
        addtionalModules: ["sap/m/routing/Router", "sap/ui/thirdparty/datajs"]
      })
    )
  );
};

var build = ({ preload = false }) => {
  var tasks = merge(copy({ preload }), buildJs(), buildCss());
  if (preload) {
    return tasks
      .pipe(gulp.dest(DEST_ROOT))
      .pipe(
        filter([
          "**/*.js",
          "**/*.xml",
          "**/*.properties",
          "**/*.json",
          "!**/preload.js",
          "!**/lib/*"
        ])
      )
      .pipe(ui5preload({ base: `${DEST_ROOT}`, namespace }));
  } else {
    return tasks;
  }
};

gulp.task("clean", () => del(DEST_ROOT));

gulp.task("build:mem", () => {
  return build().pipe(gulpMem.dest(DEST_ROOT));
});

gulp.task("build", () => {
  return build({ preload: true }).pipe(gulp.dest(DEST_ROOT));
});

gulp.task("bs", () => {
  var middlewares = require("./proxies");
  middlewares.push(gulpMem.middleware);
  browserSync.init({
    server: {
      baseDir: DEST_ROOT,
      middleware: middlewares
    },
    notify: false,
    startPath: "index.html"
  });
});

gulp.task("bs:test", () => {
  var middlewares = require("./proxies");
  middlewares.push(gulpMem.middleware);
  browserSync.init({
    server: {
      baseDir: DEST_ROOT,
      middleware: middlewares,
      notify: false
    },
    startPath: "test/mockServer.html"
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

gulp.task("watch:mem", () => {
  gulp.watch(`${SRC_ROOT}/**/*`, gulp.series(["build:mem", "reload"]));
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

gulp.task(
  "default",
  gulp.series("clean", "build:mem", gulp.parallel("bs", "watch:mem"))
);

gulp.task("test", gulp.series(["clean", "build:mem", "bs:test", "watch:mem"]));
