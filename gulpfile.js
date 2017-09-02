// gulpJs file configurations
var gulp = require('gulp');
// requires gulp-connect to create server
var connect = require('gulp-connect');
// requires gulp-clean to clean dest folder
var del = require('del');
// requires run-sequence to run tasks in async
var runSequence = require('run-sequence');
// requires gulp-rename to rename files
var rename = require('gulp-rename');
// requires gulp-jshint, gulp-uglify
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
// requires gulp-sass and gulp-minify-css to compile and minify css
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
// requires gulp-concat to concat and js and css
var concat = require('gulp-concat');
// requires browserify and vinyl-source-stream for AMD loading
var browserify = require('browserify');
var source = require('vinyl-source-stream');
// requires gulp-watch to watch js and css
var watch = require('gulp-watch');
// requires gulp-newer and gulp-imagemin to optimise images
var newer = require('gulp-newer');
var imagemin = require('gulp-imagemin');
// requires gulp-inject to inject css and js dynamically
var inject = require('gulp-inject');
var wiredep = require('wiredep').stream;
// requires gulp-util
var gutil = require('gulp-util');
var annotate= require('gulp-ng-annotate');
var streamify= require("gulp-streamify");

var isDist = false;

var paths = {
    dist: 'dist/',
    scss: 'src/scss/',
    styles: 'src/css/',
    fonts: 'src/fonts/',
    resources: 'resources/',
    bower: 'bower_components/',
    scripts: 'src/js/',
    images: 'src/images/',
    html: 'src/html/'
};

var appFiles = {
    scss: [
        paths.scss + '*.scss'
    ],
    styles: [
        paths.styles + '*.css'
    ],
    fonts: [
        paths.fonts + '*'
    ],
    resources: [
        paths.resources + '*'
    ],
    scripts: [
        paths.scripts + '**/*.js',
        'src/**/*.js',
        '!' + paths.scripts + 'bundled.js'
    ],
    html: [
        'index.html',
        paths.html + '**/*.html'
    ],
    images: [
        paths.images + '*'
    ]
};


// images-deploy task to optimize images
gulp.task('images-deploy', function () {
    return gulp.src(appFiles.images, {base: '.'})
        .pipe(newer(paths.dist))
        .pipe(imagemin({optimizationLevel: 5}))
        .pipe(gulp.dest(paths.dist));
});

// jshint, beautify and browserify scripts
gulp.task('scripts', function () {
    gulp.src(appFiles.scripts)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
    // browserify scripts 
    return browserify(paths.scripts + 'index.js' ,{debug: true})
        .bundle()
        .pipe(source('bundled.js'))
        .pipe(gulp.dest(paths.scripts))
        .on('error', gutil.log)
        .pipe(connect.reload());
});

gulp.task('ngAnnotate', function () {
  return gulp.src(appFiles.scripts)
  .pipe(annotate())
  .pipe(gulp.dest('ngAnnotate'));
});

gulp.task('browserify-min', ['ngAnnotate'], function () {
  return browserify('ngAnnotate/app.js')
  .bundle()
  .pipe(source('bundled.min.js'))
  .pipe(streamify(uglify({mangle: false})))
  .pipe(gulp.dest(paths.dist));
});

gulp.task('scripts-deploy', ['scripts'], function () {
    gulp.src(paths.scripts + '**/*.js', {base: '.'})
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.dist));
});

//gulp task to convert scss to css
gulp.task('styles', function () {
    return gulp.src(appFiles.scss)
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(concat('style.css'))
        .on('error', gutil.log)
        .pipe(gulp.dest(paths.styles), {overwrite: true})
        .pipe(connect.reload());
});


gulp.task('styles-deploy', ['styles'], function () {
    var opts = {comments: true, spare: true};
    gulp.src(appFiles.styles, {base: '.'})
        .pipe(cleanCSS(opts))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.dist));
});

gulp.task('html', function () {
    return gulp.src(appFiles.html)
        .pipe(connect.reload())
        .on('error', gutil.log);
});

gulp.task('html-deploy', function () {
    gulp.src(appFiles.html, {base: '.'})
        .pipe(gulp.dest(paths.dist));
    gulp.src(paths.bower + '**', {base: '.'})
        .pipe(gulp.dest(paths.dist));
    gulp.src(appFiles.fonts, {base: '.'})
        .pipe(gulp.dest(paths.dist));
    gulp.src(appFiles.resources, {base: '.'})
        .pipe(gulp.dest(paths.dist));
});


// configure which files to watch and what tasks to use on file changes
gulp.task('watch', function () {
    gulp.watch(appFiles.scripts, ['scripts']);
    gulp.watch(appFiles.scss, ['styles']);
    gulp.watch(appFiles.html, ['html']);
    // Other watchers
});

gulp.task('clean', function () {
    del('dest');
});

gulp.task('file-inject', ['styles', 'scripts'], function () {
    var indexPath = isDist ? 'dist/index.html' : 'index.html';
    var injectStyles = isDist ? paths.dist + paths.styles + 'style.min.css' : paths.styles + 'style.css';
    var injectScript = isDist ? paths.dist + /*paths.scripts + */'bundled.min.js' : paths.scripts + 'bundled.js';
    var wiredepOptions = {
        directory: paths.bower,
        ignorePath: '../'
    };
    return gulp.src(indexPath)
        .pipe(wiredep(wiredepOptions))
        .pipe(gulp.dest(function (file) {
            return file.base;
        }))
        .pipe(inject(gulp.src(injectStyles, {read: false}), {relative: true}))
        .pipe(gulp.dest(function (file) {
            return file.base;
        }))
        .pipe(inject(gulp.src(injectScript, {read: false}), {relative: true}))
        .pipe(gulp.dest(function (file) {
            return file.base;
        }))
});

// gulp task to create localhost
gulp.task('connect', function () {
    connect.server({
        root: '',
        port: 8888,
        livereload: true
    });
});

gulp.task('connectDist', function () {
    connect.server({
        root: paths.dist,
        port: 9999
    });
});

// default task
gulp.task('default', function () {
    isDist = false;
    runSequence(
        ['styles', 'scripts', 'file-inject', 'connect'],
        ['watch']
    );
});

// task to run while deployment
gulp.task('build', ['clean'], function () {
    isDist = true;
    runSequence(
        ['browserify-min', 'styles-deploy', 'html-deploy', 'images-deploy'],
        ['file-inject', 'connectDist']
    );
});