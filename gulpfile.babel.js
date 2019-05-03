import gulp from 'gulp';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import cssmin from 'gulp-cssmin';
import rename from 'gulp-rename';
import sass from 'gulp-sass';

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
};

const styles = () => {
  return gulp
    .src(['node_modules/@babel/polyfill/dist/polyfill.js', paths.styles.src])
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(cssmin())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.styles.dest));
};

const scripts = () => {
  return gulp
    .src(paths.scripts.src)
    .pipe(babel({ presets: ['@babel/env'] }))
    .on('error', swallowError)
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(paths.scripts.dest));
};

const watch = () => {
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.scripts.src, scripts);
};


// const build = gulp.series(watch, gulp.parallel(styles, scripts));
const build = gulp.parallel(scripts, styles, watch);

gulp.task('default', build);

export { build, watch };

