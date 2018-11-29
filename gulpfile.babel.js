import gulp from 'gulp';
import babel from 'gulp-babel';
import sass from 'gulp-sass';
import cssmin from 'gulp-cssmin';
import rename from 'gulp-rename';
import concat from 'gulp-concat';

const paths = {
  styles: {
    src: 'sources/*.scss',
    dest: './'
  },
  scripts: {
    src: 'sources/*.js',
    dest: './'
  }
};

const swallowError = (error) => {
  console.log(error.toString());
  this.emit('end');
}

const styles = () => {
  return gulp
    .src('./sources/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(cssmin())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.styles.dest));
};

const scripts = () => {
  return gulp
    .src('./sources/*.js/')
    .pipe(babel({ presets: ['@babel/env'] }))
    .on('error', swallowError)
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(paths.scripts.dest));
};

const watch = () => {
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.scripts.src, scripts);
};


const build = gulp.series(watch, gulp.parallel(styles, scripts));

gulp.task('default', build);


export default build;