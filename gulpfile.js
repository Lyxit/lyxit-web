var glob              = require('glob'),
    gulp              = require('gulp'),
    del               = require('del'),
    less              = require('gulp-less'),
    autoprefixplugin  = require('less-plugin-autoprefix'),
    autoprefix        = new autoprefixplugin({ browsers: ["last 2 versions"] }),
    jade              = require('gulp-jade'),
    concat            = require('gulp-concat'),
    inject            = require('gulp-inject'),
    insert            = require('gulp-insert');

/* DATA */

var paths = {
  index: './src/index.jade',
  project_data: './src/data/project-list.data',
  src: './src/assets/**/*',
  build: './build/',
  less: './src/less/',
  temp: './build/temp/'
};

/* TASKS */
gulp.task('build', ['jade', 'css'], function() {
  del([
    'build/temp/'
  ]);

  return gulp
  .src(paths.src)
  .pipe(gulp.dest(paths.build + 'assets/'))
});

gulp.task('clean', function() {
  del([
      'build/**/*'
  ]);
});

gulp.task('insert', ['insert:colors', 'insert:styles']);

gulp.task('insert:colors', function() {
  var lesscolors = "";

  var data = require(paths.project_data);
  for(var prop in data.projects) {
    lesscolors = lesscolors + '@' + prop + '-color: ' + data.projects[prop].color + ';';
  }

  return gulp
    .src(paths.less + 'vars.less')
    .pipe(insert.append(lesscolors))
    .pipe(gulp.dest(paths.temp + 'less'));
});

gulp.task('insert:styles', function() {
  var lesstyles = "";

  var data = require(paths.project_data);
  for(var prop in data.projects) {
    var type = data.projects[prop].web ? "web" : "icon";
    lesstyles = lesstyles + '.' + prop + '{ background: @' + prop + '-color; a .' + type + 'image { background-image: url("../img/' + prop + '.png")}}';
  }

  return gulp
    .src(paths.less + 'style.less')
    .pipe(insert.append(lesstyles))
    .pipe(gulp.dest(paths.temp + 'less'));
});

gulp.task('css', ['insert'], function() {
    return gulp
    .src(paths.temp + 'less/style.less')
    .pipe(less({
        plugins: [autoprefix]
    }))
    .pipe(gulp.dest(paths.build + 'assets/css/'));
});

gulp.task('jade', function() {
    return gulp
    .src(paths.index)
    .pipe(jade({
        data: require(paths.project_data),
        pretty: true
    }))
    .pipe(gulp.dest(paths.build))
});
