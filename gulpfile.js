var glob              = require('glob'),
    gulp              = require('gulp'),
    del               = require('del'),
    less              = require('gulp-less'),
    autoprefixplugin  = require('less-plugin-autoprefix'),
    autoprefix        = new autoprefixplugin({ browsers: ["last 2 versions"] }),
    jade              = require('gulp-jade'),
    concat            = require('gulp-concat'),
    inject            = require('gulp-inject'),
    insert            = require('gulp-insert'),
    async             = require('async'),
    rename            = require('gulp-rename');

/* DATA */

var paths = {
  index: './src/index.jade',
  project_data: './src/data/project-list.data',
  src: './src/assets/**/*',
  build: './build/',
  less: './src/less/',
  temp: './build/temp/',
  templates: './src/templates/'
};

/* TASKS */
gulp.task('build:index', ['index:jade', 'index:css'], function() {
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

gulp.task('index:insert', ['index:insert:colors', 'index:insert:styles']);

gulp.task('index:insert:colors', function() {
  var lesscolors = "";

  var data = projectData();
  for(var prop in data.projects) {
    lesscolors = lesscolors + '@' + prop + '-color: ' + data.projects[prop].color + ';';
  }

  return gulp
    .src(paths.less + 'vars.less')
    .pipe(insert.append(lesscolors))
    .pipe(gulp.dest(paths.temp + 'less'));
});

gulp.task('index:insert:styles', function() {
  var lesstyles = "";

  var data = projectData();
  for(var prop in data.projects) {
    var type = data.projects[prop].web ? "web" : "app";
    lesstyles = lesstyles + '.' + prop + '{ background: @' + prop + '-color; a .' + type + 'image { background-image: url("../img/' + prop + '.png")}}';
  }

  return gulp
    .src(paths.less + 'style.less')
    .pipe(insert.append(lesstyles))
    .pipe(gulp.dest(paths.temp + 'less'));
});

gulp.task('index:css', ['index:insert'], function() {
    return gulp
    .src(paths.temp + 'less/style.less')
    .pipe(less({
        plugins: [autoprefix]
    }))
    .pipe(gulp.dest(paths.build + 'assets/css/'));
});

gulp.task('index:jade', function() {
  return gulp
    .src(paths.index)
    .pipe(jade({
        data: projectData(),
        pretty: true
    }))
    .pipe(gulp.dest(paths.build))
});

gulp.task('build:projects', function(done) {
  var projects = projectArray();

  var generateProject = function(prj) {
    var prj = projects[i];
    var partInsertion = partsForProject(prj);

    return function (cb) {
      gulp
        .src(paths.templates + 'project-shell.jade')
        .pipe(insert.append(partInsertion))
        .pipe(jade({
          data: prj,
          pretty: true
        }))
        .pipe(rename('index.html'))
        .pipe(gulp.dest(paths.build + 'projects/' + prj.key));
    }
  };

  var tasks = [];
  for (var i = 0; i < projects.length; i++) {
    var prj = projects[i];
    tasks.push(generateProject(prj));
  }
  async.parallel(tasks, function() {
    console.log ('Finished build:projects');
  });
});

var partsForProject = function(prj) {
  if (prj.parts) {
    var partInsertion = "";
    for (var i = 0; i < prj.parts.length; i++) {
      partInsertion = partInsertion + '    include ' + prj.parts[i] + '.jade\n';
    }
    return partInsertion + '    include foot.jade\n';
  }
  return "";
}

var projectData = function() {
  return require(paths.project_data);
}

var projectArray = function() {
  var data = projectData();
  var projects = [];

  for (var prop in data.projects) {
    var prj = data.projects[prop];
    prj.key = prop;
    projects.push(prj);
  }

  return projects;
}
