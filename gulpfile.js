const babel = require("gulp-babel");
const gulp = require("gulp");
const concat = require("gulp-concat");
const watch = require("gulp-watch");
const cleanCSS = require("gulp-clean-css");

const chemins = {
  sources: "./src/",
  distrib: "./distrib/",
  demo: "docs/demo/modules/htmlelement-contextmenu/distrib/"
};



gulp.task("htmlelement-contextmenu.min.js", () => {
  return gulp.src([
      "node_modules/web-browser-detection/distrib/web-browser-detection.min.js",
      "src/**.js"
    ])
    .pipe(concat("htmlelement-contextmenu.min.js"))
    .pipe(babel({
      presets: ["es2015"],
      comments: false,
      compact: true,
      minified: true,
      plugins: ["minify-mangle-names"]
    }))
    .pipe(gulp.dest(chemins.distrib))
});

gulp.task("htmlelement-contextmenu.js", () => {
  return gulp.src([
      "node_modules/web-browser-detection/distrib/web-browser-detection.min.js",
      "src/**.js"
    ])
    .pipe(concat("htmlelement-contextmenu.min.js"))
    .pipe(babel({
      presets: ["es2015"],
      comments: false,
      minified: false,
      compact: false,
      plugins: ["minify-mangle-names"]
    }))
    .pipe(gulp.dest(chemins.demo))
});

gulp.task("css", () => {
  return gulp.src([
      "src/**.css"
    ])
    .pipe(concat("htmlelement-contextmenu.min.css"))
    .pipe(cleanCSS())
    .pipe(gulp.dest(chemins.distrib))
});

gulp.task("index.html", () => {
  return gulp.src([
      "src/**.html", "src/*.png"
    ])
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
    gulp.run("demo");
  });
});

gulp.task("demo", ["htmlelement-contextmenu.js", "css"], () => {
  return gulp.src([
      chemins.distrib + "htmlelement-contextmenu.min.css"
    ])
    .pipe(gulp.dest(chemins.demo))
});

gulp.task("default", ["htmlelement-contextmenu.min.js", "index.html", "css", "demo"]);


gulp.task("all", ["default"]);

gulp.task("watch", ["watch:htmlelement-contextmenu.min.js", "watch:html", "watch:css"]);