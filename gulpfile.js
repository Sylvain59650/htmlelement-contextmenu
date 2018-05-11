const babel = require("gulp-babel");
const gulp = require("gulp");
const concat = require("gulp-concat");
const debug = require("gulp-debug");
const watch = require("gulp-watch");

const chemins = {
  sources: "./src/",
  distrib: "./distrib/"
};



gulp.task("htmlelement-contextmenu.min.js", () => {
  return gulp.src([
      "node_modules/web-browser-detection/distrib/web-browser-detection.min.js",
      "src/**.js"
    ])
    .pipe(concat("htmlelement-contextmenu.min.js"))
    .pipe(babel({
      presets: ["es2015"],
      compact: false
    }))
    .pipe(debug())
    //.pipe(uglify())
    //.on('error', function(err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
    // .pipe(umd())
    .pipe(gulp.dest(chemins.distrib))
});


gulp.task("css", () => {
  return gulp.src([
      "src/**.css"
    ])
    .pipe(concat("htmlelement-contextmenu.min.css"))
    .pipe(debug())
    .pipe(gulp.dest(chemins.distrib))
});

gulp.task("index.html", () => {
  return gulp.src([
      "src/**.html", "src/*.png"
    ])
    .pipe(debug())
    .pipe(gulp.dest(chemins.distrib))
});

gulp.task("watch:css", function() {
  watch("./src/**.css", function() {
    gulp.run("css");
  });
});

gulp.task("watch:html", function() {
  watch(["./src/index.html", "./src/*.png"], function() {
    gulp.run("index.html");
  });
});

gulp.task("watch:htmlelement-contextmenu.min.js", function() {
  watch("./src/**.js", function() {
    gulp.run("htmlelement-contextmenu.min.js");
  });
});


gulp.task("default", ["htmlelement-contextmenu.min.js", "index.html", "css"]);


gulp.task("all", ["default"]);

gulp.task("watch", ["watch:htmlelement-contextmenu.min.js", "watch:html", "watch:css"]);