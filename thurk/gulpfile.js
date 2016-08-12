var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var babel = require('gulp-babel');
var browserify = require('gulp-browserify');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');

var path = require('path');

var paths = {
  serverSrc: 'src/serv/**/*.js',
  serverDest: 'server',
  clientJsSrc: 'src/cli/js/**/*.js',
  clientJsDest: 'public/js',
  clientCssSrc: 'src/cli/css/**/*.css',
  clientCssDest: 'public/css'
};

/*
 * CLIENT
 */

function cleanClient(cb) {
  return del([path.join(paths.clientJsDest, '**/*.js'),
              path.join(paths.clientCssDest, '**/*.css')]).then(function(ps) {
                console.log('Expunged:\n' + ps.join('\n'));
                cb();
              });
}

function babelifyClient() {
  return gulp.src(paths.clientJsSrc)
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['react-es2015'],
      plugins: ['transform-object-assign']
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.clientJsDest));
}
function css() {
  return gulp.src(paths.clientCssSrc).pipe(gulp.dest(paths.clientCssDest));
}
function bfDev() {
    return gulp.src(path.join(paths.clientJsDest, 'registry-cache.js'))
    .pipe(browserify({
      "browserify-css": {
        autoInject: true
      },
      insertGlobals: true,
      debug: true
    }))
    .pipe(gulp.dest(path.join(paths.clientJsDest, 'bundle')));
}
var buildClient = gulp.series(cleanClient, gulp.parallel(babelifyClient, css), bfDev);
function cwatch() {
  return gulp.watch([paths.clientJsSrc, paths.clientCssSrc], buildClient);
}

/*
 * SERVER
 */

function cleanServer(cb) {
  del([path.join(paths.serverDest, '**/*.js')]).then(function(ps) {
    console.log('Expunged:\n' + ps.join('\n'));
    cb();
  });
}

function server() {
  return gulp.src(paths.serverSrc)
    .pipe(babel({
      presets: ['react-es2015'],
      plugins: ['transform-object-assign']
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.serverDest));
}

var buildServer = gulp.series(cleanServer, server);
function swatch() {
  return gulp.watch([paths.serverSrc], buildServer);
}

var watchAll = gulp.parallel(swatch, cwatch);

/*
 * TASKS
 */

gulp.task('sclean', cleanServer);
gulp.task('server', server);
gulp.task('buildServer', buildServer);
gulp.task('swatch', swatch);
gulp.task('buildClient', buildClient);
gulp.task('cwatch', cwatch);
gulp.task('corre', gulp.series('buildServer', 'buildClient',
                               gulp.parallel('swatch', 'cwatch', function() {
                                 setTimeout(function() {
                                   nodemon({
                                     ignore: ['node_modules/**', 'src/cli/**', 'public/**'],
                                     script: './server/dreadache.js',
                                     //      tasks: ['buildServer'],
                                     delay: 5
                                   });
                                 }, 5000);
                               })));

// gulp.task('default', 'corre');
