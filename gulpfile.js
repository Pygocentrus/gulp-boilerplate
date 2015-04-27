/* Custom configuration files */
var conf = require('./gulp-conf');

/* Gulp plugins */
var gulp         = require('gulp'),
    browserSync  = require('browser-sync'),
    rename       = require("gulp-rename"),
    rev          = require('gulp-rev'),
    sass         = require('gulp-sass'),
    compass      = require('gulp-compass'),
    concat       = require('gulp-concat'),
    uglify       = require('gulp-uglify'),
    clean        = require('gulp-clean'),
    minifyCSS    = require('gulp-minify-css'),
    autoprefix   = require('gulp-autoprefixer'),
    htmlmin      = require('gulp-htmlmin'),
    htmlreplace  = require('gulp-html-replace'),
    imagemin     = require('gulp-imagemin'),
    sourcemaps   = require('gulp-sourcemaps'),
    util         = require('gulp-util'),
    gulpSequence = require('gulp-sequence'),
    pngquant     = require('imagemin-pngquant'),
    es           = require('event-stream'),
    wallpaper    = require('wallpaper'),
    reload       = browserSync.reload;

/* Concatenates vendor & custom styles + sass compilation */
gulp.task('styles', function () {
  var vendors = conf.styles.lib.files.map(function(fileName) { return conf.styles.lib.prefix + fileName; }),
      custom = conf.styles.custom.files.map(function(fileName) { return conf.styles.custom.prefix + fileName; }),
      cssFiles = gulp.src(vendors.concat(custom)),
      sassFiles = gulp.src(conf.paths.sass + '/' + conf.sassConf.mainSass + conf.sassConf.stylesFormat);

  if (!!conf.compassConf.usesCompass) {
    /* If we use the compass framework */
    sassFiles = sassFiles
      .pipe(sourcemaps.init())
      .pipe(compass({
        config_file: conf.compassConf.configRbPath,
        css: conf.paths.css,
        sass: conf.paths.sass,
        image: conf.paths.images,
        require: ['reset']
      }));
  } else {
    /* Otherwise we only compile sass files */
    sassFiles = sassFiles
      .pipe(sourcemaps.init())
      .pipe(sass(conf.sassConf));
  }

  var task = es.concat(cssFiles, sassFiles)
    .pipe(autoprefix(conf.autoprefixerConf))
    .pipe(concat('production.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(conf.paths.styles));

  return browserSync.active ? task.pipe(reload({ stream: true })) : task;
});

/* Javascript tast */
gulp.task('scripts', function() {
  var vendors = conf.scripts.lib.files.map(function(fileName) { return conf.scripts.lib.prefix + fileName; }),
      custom = conf.scripts.custom.files.map(function(fileName) { return conf.scripts.custom.prefix + fileName; });

  var task = gulp.src(vendors.concat(custom))
    .pipe(sourcemaps.init())
    .pipe(concat('production.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(conf.paths.scripts));
});

/* Dist image optimization */
gulp.task('images', function() {
  return gulp.src(conf.paths.images + '/*')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest(conf.paths.dist + '/img'));
});

/* Dist styles minification */
gulp.task('build-styles', ['styles'], function () {
  return gulp.src(conf.paths.styles + '/production.css')
    .pipe(minifyCSS({keepSpecialComments: 0, advanced: false}))
    .pipe(rename("production.min.css"))
    .pipe(rev())
    .pipe(gulp.dest(conf.paths.dist + '/styles'))
    .pipe(rev.manifest('rev-manifest-styles.json'))
    .pipe(gulp.dest(conf.paths.dist));
});

/* Dist scripts minification */
gulp.task('build-scripts', ['scripts'], function () {
  return gulp.src(conf.paths.scripts + '/production.js')
    .pipe(uglify())
    .pipe(rename("production.min.js"))
    .pipe(rev())
    .pipe(gulp.dest(conf.paths.dist + '/scripts'))
    .pipe(rev.manifest('rev-manifest-scripts.json'))
    .pipe(gulp.dest(conf.paths.dist));
});

/* Dist html minification and file rev replacement */
gulp.task('build-html', function () {
  var stylesRev = require('./'+ conf.paths.dist +'/rev-manifest-styles.json')['production.min.css'],
      scriptsRev = require('./'+ conf.paths.dist +'/rev-manifest-scripts.json')['production.min.js'];

  return gulp.src(conf.paths.app + '/index.html')
    .pipe(htmlreplace({
        css: "styles/" + stylesRev,
        js: "scripts/" + scriptsRev
      }))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(conf.paths.dist));
});

/* Dist image optimization */
gulp.task('images', function() {
  return gulp.src(conf.paths.images + '/*')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest(conf.paths.dist + '/img'));
});

/*
  Live browserSync server, taking care of the
  styles and scripts changes automatically
 */
gulp.task('serve', ['styles', 'scripts'], function () {
  /* Start browsersync for socket live reload */
  browserSync({
    // proxy: conf.paths.proxy || undefined,
    notify: false,
    server: "./" + conf.paths.app,
    ghostMode: {
      clicks: true,
      forms: true,
      scroll: true
    }
  });

  /* Watch styles */
  gulp.watch([
    conf.paths.styles + '/**/*' + conf.sassConf.stylesFormat,
    conf.paths.styles + '/**/*.css',
    '!' + conf.paths.styles + '/production.css'
  ], ['styles']);

  /* Watch scripts */
  gulp.watch([
    conf.paths.scripts + '/**/*.js',
    '!' + conf.paths.scripts + '/production.js'
  ], ['scripts', reload]);

  /* Watch html */
  gulp.watch(conf.paths.app + '/*.html').on('change', reload);
});

/* Copy important files into the dist folder */
gulp.task('copy', function() {
  return gulp.src([
      conf.paths.app + '/*',
      '!' + conf.paths.app + '/*.html',
      '!' + conf.paths.app + '/bower_components'
    ], { dot: true })
  .pipe(gulp.dest(conf.paths.dist));
});

/* Total dist cleaning */
gulp.task('clean-before', function() {
  return gulp.src(conf.paths.dist)
    .pipe(clean({ force: true }));
});

/* After-build cleaning to remove manifests */
gulp.task('clean-after', function() {
  return gulp.src([conf.paths.dist + '/rev-manifest-*'])
    .pipe(clean());
});

/* Simple scripts and styles build */
gulp.task('default', ['scripts', 'styles'], function() {
  wallpaper.set('app/img/cat.jpg', function() {
    console.log('much love <3');
  });
});

/* Build task, concat & uglify + image optimization */
gulp.task('build', gulpSequence('clean-before', ['build-styles', 'build-scripts'], ['build-html', 'images', 'copy'], 'clean-after'));
