'use strict';

let gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-minify-css'),
    rimraf = require('rimraf'),
    notify = require('gulp-notify'),
    debug = require('gulp-debug'),
    imagemin = require('gulp-imagemin'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;



let path = {
    build: {
        html: 'build/',
        pages: 'build/pages/',
        js: 'build/js/',
        css: 'build/css/',
        i: 'build/i/',
        uploads: 'build/uploads/',
        fonts: 'build/fonts/',
        video: 'build/video/'
    },
    src: {
        html: 'src/*.html',
        pages: 'src/pages/*.html',
        js: 'src/js/*.js',
        style: 'src/sass/**/*.scss',
        i: 'src/i/*.*',
        uploads: 'src/uploads/*.*',
        fonts: 'src/fonts/*.*',
        video: 'src/video/*.*'
    },
    watch: {
        html: 'src/*.html',
        pages: 'src/pages/*.html',
        js: 'src/js/*.js',
        style: 'src/sass/**/*.scss',
        i: 'src/i/*.*',
        uploads: 'src/uploads/*.*',
        fonts: 'src/fonts/*.*',
        video: 'src/video/*.*'
    },
    clean: './build'
};

let config = {
    server: {
        baseDir: "./build"
    },
    tunnel: false,
    host: 'localhost',
    port: 9000
};







gulp.task('html:build', function () {
    return gulp.src(path.src.html)
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});

gulp.task('pages:build', function () {
    return gulp.src(path.src.pages)
        .pipe(gulp.dest(path.build.pages))
        .pipe(reload({stream: true}));
});


gulp.task('js:build', function () {
    return gulp.src(path.src.js)
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});



gulp.task('style:build', function() {
    return gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(autoprefixer({overrideBrowserslist: ['last 2 versions', '>.01%'], cascade: false}))
        //.pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});


gulp.task('i', function () {
    return gulp.src(path.src.i)
        .pipe(debug({title: 'image'}))
        .pipe(gulp.dest(path.build.i))
        .pipe(imagemin({interlaced: true}))
        .pipe(reload({stream: true}));
});




gulp.task('uploads', function () {
    return gulp.src(path.src.uploads)
        .pipe(debug({title: 'image'}))
        .pipe(gulp.dest(path.build.uploads))
        .pipe(imagemin({interlaced: true}))
        .pipe(reload({stream: true}));
});

gulp.task('image:build', gulp.parallel('i', 'uploads'));


gulp.task('fonts:build', function() {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('video:build', function () {
    return gulp.src(path.src.video)
        .pipe(gulp.dest(path.build.video))
        .pipe(reload({stream: true}));
});



gulp.task('watch', function() {
    gulp.watch([path.watch.html], gulp.parallel('html:build'));
    gulp.watch([path.watch.pages], gulp.parallel('pages:build'));
    gulp.watch([path.watch.style], gulp.parallel('style:build'));
    gulp.watch([path.watch.js], gulp.parallel('js:build'));
    gulp.watch([path.watch.i, path.watch.uploads], gulp.parallel('image:build'));
    gulp.watch([path.watch.fonts], gulp.parallel('fonts:build'));
    gulp.watch([path.watch.video], gulp.parallel('video:build'));
});



gulp.task('browserSync', function () {
    browserSync(config);
});


gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});




gulp.task('build', gulp.parallel(
    'html:build',
    'pages:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build',
    'video:build'
));


gulp.task('default', gulp.series('clean', gulp.parallel('build', 'browserSync', 'watch')));

