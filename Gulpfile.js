var gulp = require('gulp');
var coffee = require('gulp-coffee');

gulp.task("default", function(){
  gulp.src("refresh.coffee")
    .pipe(coffee())
    .pipe(gulp.dest("./"));
});
