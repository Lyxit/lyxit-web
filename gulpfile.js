var glob      = require('glob'),
    gulp      = require('gulp'),
    less      = require('gulp-less'),
    jade      = require('gulp-jade'),
    concat    = require('gulp-concat');

/* DATA */

var paths = {

};

var msg = {

};

/* TASKS */

var CONFIG;

gulp.task('default', ['index', 'projects']);

gulp.task('projects', function(cb) {
  console.log ('RUNNING CONFIG!');
  glob("./src/data/*.project", function (er, files) {
    for (var i = 0; i < files.length; i++) {
      console.log ('RUNNING PROJECT: ' + files[i]);
      CONFIG = require(files[i]);
      CONFIG.parts = partsToPaths(CONFIG.parts);
      console.log ('CONFIG PARTS: ' + CONFIG.parts);

      gulp.src(CONFIG.parts)
      .pipe(concat('index.jade'))
      .pipe(jade({
        data: CONFIG,
        pretty: true
      }))
      .pipe(gulp.dest('./build/projects/' + CONFIG.name.toLowerCase()));
    }
  });
});

gulp.task('index', function() {
  gulp.src('./src/index.jade')
  .pipe(jade({
    data: require('./src/data/project-list.data'),
    pretty: true
  }))
  .pipe(gulp.dest('./build/'))
});

/* HELPERS */
var partsToPaths = function(parts) {
  console.log ('PARTS TO PATHS!!');
  for (var i = 0; i < parts.length; i++) {
    parts[i] = './src/templates/' + parts[i] + '.jade';
  }
  return parts;
}
