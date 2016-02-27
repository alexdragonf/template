var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var less = require('gulp-less');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var notify = require('gulp-notify');
var cached = require('gulp-cached');
var remember = require('gulp-remember');
var concat = require('gulp-concat');
var cssmin = require('gulp-cssmin');
var filter = require('gulp-filter');
var gulpif = require('gulp-if');
var gutil = require('gulp-util');
// var through = require('through2');


var config = {
  minify:false
}

gulp.task('default',['less','watch','browser-sync']);
// gulp.task('default',['watch','browser-sync']);
// gulp.task('default',['browser-sync']);

// Static server
// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./public"
        },
        browser:"google-chrome-stable",
        notify:true
    });
})

gulp.task("watch",function () {
  gulp.watch(["./less/*.less"],["less"])
})




gulp.task('less',function () {
    var firstPass = cached.caches["less"]==undefined
    // console.log(firstPass);
    // return
    gulp.src('.src/less/*.less')
    .pipe(plumber(
      notify.onError({
        title:"Less",
        message:"Error: <%= error.message %>",
      })
    ))
    .pipe(sourcemaps.init())
    .pipe(cached("less"))
    .pipe(gulpif(!firstPass,notify("File <%= file.relative %> changed."),gutil.noop()))
    .pipe(less())
    .pipe(remember('less'))
    .pipe(concat('allless.css'))
    .pipe(gulpif(config.minify,cssmin(),gutil.noop()))
    .pipe(sourcemaps.write("../maps"))
    .pipe(plumber.stop())
    .pipe(gulp.dest('./public/css'))
    .pipe(filter('*.css'))
    .pipe(browserSync.stream())

})




gulp.task('notify',function () {
  gulp.src('./less/*')
  .pipe(notify('Hello world'))
})
