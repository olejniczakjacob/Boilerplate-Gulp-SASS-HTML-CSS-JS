const gulp = require('gulp');
const browserSync = require('browser-sync');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const htmlReaplace = require('gulp-html-replace');
const htmlMin = require('gulp-htmlmin');
const del = require('del');
const sequence = require('run-sequence');

gulp.task('reload', function() {
  browserSync.reload();
});

gulp.task('serve', ['sass'], function() {
 browserSync({
   server: 'public'
 })
 gulp.watch('public/*.html', ['reload']);
 gulp.watch('public/assets/scss/**/*.scss', ['sass']);
});

gulp.task('sass',function(){
  return gulp.src('public/assets/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 5 versions']
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/assets/css'))
    .pipe(browserSync.stream());
});

gulp.task('CSS', function() {
  return gulp.src('public/assets/css/**/*.css')
    .pipe(concat('style.css'))
    .pipe(gulp.dest('build/assets/css'));
});

gulp.task('minCSS', function() {
  return gulp.src('public/assets/css/**/*.css')
    .pipe(concat('style.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('build/assets/css'));
});

gulp.task('JS', function() {
    return gulp.src('public/assets/js/**/*.js')
      .pipe(concat('script.js'))
      .pipe(gulp.dest('build/assets/js'));
});
gulp.task('minJS', function() {
    return gulp.src('public/assets/js/**/*.js')
      .pipe(concat('script.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('build/assets/js'));
});

gulp.task('minHTML', function() {
    return gulp.src('public/*.html')
      .pipe(htmlReaplace({
        'css': 'assets/css/style.css',
        'js': 'assets/js/script.js'
      }))
      .pipe(htmlMin({
        sortAttributes: true,
        sortClassName: true /*,
        collapseWhitespace: true */
      }))
      .pipe(gulp.dest('build/'));
})

gulp.task('clean',function() {
  return del(['build']);
})

gulp.task('build', function() {
  sequence('clean', [ 'minHTML', 'JS', 'minJS', 'CSS', 'minCSS']);
});

gulp.task('default', ['serve']);
