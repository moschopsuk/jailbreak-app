var gulp = require('gulp'), 
    sass = require('gulp-sass') ;

var config = {
    vendorDir: './assets/vendor',
    publicDir: './public',
};

gulp.task('css', function() {
    return gulp.src('./assets/sass/app.scss')
    .pipe(sass({
        includePaths: [config.vendorDir + '/bootstrap-sass/assets/stylesheets'],
    }))
    .pipe(gulp.dest(config.publicDir + '/css'));
});

gulp.task('fonts', function() {
    return gulp.src(config.vendorDir + '/bootstrap-sass/assets/fonts/bootstrap/*')
    .pipe(gulp.dest(config.publicDir + '/fonts'));
});

gulp.task('default', ['css', 'fonts']);
