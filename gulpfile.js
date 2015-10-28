var gulp    =  require('gulp'), 
    sass    = require('gulp-sass') ,
    concat  = require('gulp-concat'),
    mocha   = require('gulp-mocha');


var config = {
    vendorDir: './assets/vendor',
    publicDir: './public',
};

gulp.task('css', function() {
    return gulp.src('./assets/sass/app.scss')
        .pipe(sass({
            includePaths: [
                config.vendorDir + '/bootstrap-sass/assets/stylesheets'
            ],
        }))
        .pipe(gulp.dest(config.publicDir + '/css'));
});

gulp.task('scripts', function() {
    return gulp.src([
            config.vendorDir +'/jquery/dist/jquery.js',
            config.vendorDir +'/moment/moment.js',
            config.vendorDir +'/moment-timezone/builds/moment-timezone-with-data.js',
            config.vendorDir +'/bootstrap-sass/assets/javascripts/bootstrap.js',
            './assets/js/gmap3.js',
            './assets/js/livestamp.js',
            './assets/js/jcrop.js',
            './assets/js/tracking-map.js',
        ])
        .pipe(concat('app.js'))
        .pipe(gulp.dest(config.publicDir + '/js'));
});

gulp.task('fonts', function() {
    return gulp.src(config.vendorDir + '/bootstrap-sass/assets/fonts/*/**')
    .pipe(gulp.dest(config.publicDir + '/fonts'));
});

gulp.task('test', function () {
    return gulp.src('spec/*Spec.js', {read: false})
        .pipe(mocha({reporter: 'spec'}));
});

gulp.task('default', ['css', 'scripts', 'fonts']);
