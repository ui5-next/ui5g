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

var packageJson = require("./package.json");

var SRC_ROOT = "./src";
var DEST_ROOT = "./dist";
var APP_NAME = packageJson.name;
var namespace = packageJson.app.namespace;
var resourceRoot = packageJson.app.resource;

var gulpMem = new GulpMem();
gulpMem.serveBasePath = DEST_ROOT;
gulpMem.enableLog = false;

var buildJs = ({ sourcemap }) => {
  // use to avoid an error cause whole gulp failed
  var b = babel().on("error", e => {
    console.log(e.stack);
    b.end();
  });
  var rt = gulp.src([`${SRC_ROOT}/**/*.js`, `!${SRC_ROOT}/**/lib/*.js`]);
  if (sourcemap) {
    rt = rt.pipe(sourcemaps.init());
  }
  rt = rt.pipe(b);
  if (sourcemap) {
    rt = rt.pipe(sourcemaps.write("/sourcemap"));
  }
  return rt;
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
        additionalResources: [
          "sap/m/messagebundle_zh_CN.properties",
          "sap/ui/core/messagebundle_zh_CN.properties"
        ],
        title: APP_NAME,
        theme: "sap_belize",
        bootScriptPath: "./index.js",
        additionalModules: [
          "sap/m/routing/Router",
          "sap/ui/thirdparty/datajs",
          "sap/m/ResponsivePopover",
          "sap/m/MessagePopover",
          "sap/m/MessageListItem",
          "sap/m/SegmentedButton",
          "sap/m/MessageItem",
          "sap/m/NotificationListItem",
          "sap/m/MessagePopoverItem",
          "sap/m/MessageToast"
        ]
      })
    )
  );
};

var build = ({ preload = false, sourcemap = false }) => {
  var tasks = merge(copy({ preload }), buildJs({ sourcemap }), buildCss());
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
  return build({ preload: false, sourcemap: true }).pipe(gulpMem.dest(DEST_ROOT));
});

gulp.task("build:sourcemap", () => {
  return build({ preload: true, sourcemap: true }).pipe(gulp.dest(DEST_ROOT));
});

gulp.task("build", () => {
  return build({ preload: true, sourcemap: false }).pipe(gulp.dest(DEST_ROOT));
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

gulp.task(
  "dev",
  gulp.series("clean", "build:mem", gulp.parallel("bs", "watch:mem"))
);

gulp.task(
  "dev:preload",
  gulp.series("clean", "build:sourcemap", gulp.parallel("bs", "watch"))
);
