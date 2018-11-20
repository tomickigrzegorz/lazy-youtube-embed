const gulp = require('gulp');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const cssmin = require('gulp-cssmin');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const browserSync = require('browser-sync');

function swallowError(error) {
  console.log(error.toString());
  this.emit('end');
}

gulp.task('sass', function () {
  return gulp
    .src('./sources/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(cssmin())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('js', function () {
  return gulp
    .src('./sources/*.js/')
    .pipe(babel({ presets: ['@babel/env'] }))
    .on('error', swallowError)
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('html', function () {
  return gulp.src('./sources/index.html').pipe(gulp.dest('./dist'));
});

gulp.task('watch', function () {
  gulp.watch('sources/index.html', ['html', 'sass', 'js']).on('change', browserSync.reload);
  gulp.watch('sources/*.scss', ['sass']).on('change', browserSync.reload);
  gulp.watch('sources/*.js', ['js']).on('change', browserSync.reload);
});

gulp.task('default', ['watch', 'html', 'sass', 'js']);
