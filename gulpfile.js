'use strict';

/*

TODO:
This file doesn't work.
It's just a set of example tasks.

*/

var gulp = require('gulp');
var gulpif = require('gulpif');

var source = require('vinyl-source-stream');
var watchify = require('watchify');
var browserify = require('browserify');
var uglify = require('uglify');

var sass = require('sass');
var bourbon = require('bourbon');


gulp.task('styles', function () {
  return gulp.src('./src/scss/main.scss')
    .pipe(sass({
      outputStyle: gulp.env.production ? 'compressed' : 'expanded',
      includePaths: ['./src/scss'].concat(bourbon),
      errLogToConsole: gulp.env.watch
    }))
    .pipe(gulp.dest('./dist/css'));
});



gulp.task('watch', function() {
  var bundler = watchify('./app/scripts/app.jsx');

  // Optionally, you can apply transforms
  // and other configuration options on the
  // bundler just as you would with browserify
  bundler.transform('brfs');

  function rebundle () {
    return bundler.bundle()
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('./dist'));
  }

  bundler.on('update', rebundle);

  return rebundle();
});

gulp.task('scripts', function() {
  return gulp.src('./src/js/app.js', {read: false})
    .pipe(browserify({
      insertGlobals : false,
      transform: ['reactify'],
      extensions: ['.jsx'],
      debug: !gulp.env.production
  }))
  .pipe(gulpif(gulp.env.production, uglify({
    mangle: {
      except: ['require', 'export', '$super']
    }
  })))
  .pipe(gulp.dest('./dist/js'));
});

gulp.task('default', function() {
  // place code for your default task here
});