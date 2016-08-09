var gulp = require('gulp');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');

var path = require('path');

var paths = {
  serverSrc: 'src/server/**/*.js',
  serverDest: 'server'
};

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
  gulp.watch([paths.serverSrc], buildServer);
}

/*
 * TASKS
 */

gulp.task('sclean', cleanServer);
gulp.task('server', server);
gulp.task('buildServer', buildServer);
gulp.task('swatch', swatch);

gulp.task('default', swatch);