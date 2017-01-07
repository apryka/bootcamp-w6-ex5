const gulp = require('gulp');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const del = require('del');
const add = require('gulp-add-src');
const browserSync = require('browser-sync');
const server = browserSync.create();

gulp.task('css', ()=>{
  return gulp.src('./src/scss/**/*.scss')
    .pipe(sass())
    .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
    .pipe(add('./node_modules/bootstrap/dist/css/bootstrap.css'))
    .pipe(concat('style.min.css'))
    .pipe(cleanCSS({keepSpecialComments: 0}))
    .pipe(gulp.dest('./dist/css'))
})

gulp.task('script', ()=>{
  return gulp.src('./src/**/*.js')
  .pipe(babel({
      presets: ['es2015']
  }))
  .pipe(uglify())
  .pipe(concat('main.min.js'))
  .pipe(gulp.dest('./dist/js'))
});

gulp.task('image', ()=>{
  return gulp.src('./src/images/*')
  .pipe(imagemin())
  .pipe(gulp.dest('./dist/images'))
})

gulp.task('html', ()=>{
  return gulp.src('./*.html')
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest('./dist'))
})

gulp.task('clean:dist', function() {
  return del.sync('dist');
})

gulp.task('build', [`clean:dist`, `html`, `css`, `script`, `image`], function (){
  console.log('Building files');
})

gulp.task('watch', ()=>{

    gulp.watch(['./src/**/*.js'],['script']);
    gulp.watch(['./src/scss/**/*.scss'], ['css']);
    gulp.watch(['./*.html'],['html']);

})

gulp.task('serve',['build'], ()=>{
    server.init({
        server:{
            baseDir: './dist'
        },
        port:8080
    })

    gulp.watch(['./src/**/*.js'],['script'])
    gulp.watch(['./dist/**/*.js'], ()=>{
        server.reload();
    })

    gulp.watch(['./src/scss/**/*.scss'],['css'])
    gulp.watch(['./dist/**/*.css'], ()=>{
        server.reload();
    })

    gulp.watch(['./*.html'],['html'])
    gulp.watch(['./dist/*.html'], ()=>{
      server.reload();
    })
})
