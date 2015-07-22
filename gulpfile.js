var glob              = require('glob'),
    gulp              = require('gulp'),
    del               = require('del'),
    less              = require('gulp-less'),
    autoprefixplugin  = require('less-plugin-autoprefix'),
    autoprefix        = new autoprefixplugin({ browsers: ["last 2 versions"] }),
    jade              = require('gulp-jade'),
    concat            = require('gulp-concat');

/* DATA */

var paths = {
  index: './src/index.jade',
  project_data: './src/data/project-list.data',
  templates: './src/templates/',
  src_assets: './src/assets/',
  build: './build/',
  build_assets: './build/assets/',
  build_css: './build/assets/css/'
};

var msg = {

};

/* TASKS */

gulp.task('default', ['clean:build', 'build', 'index', 'less']);

gulp.task('clean:build', function(cb) {
  del([
    'build/**/*'
  ], cb);
});

gulp.task('less', ['clean:build'], function() {
  gulp.src('./src/less/style.less')
  .pipe(less({
    plugins: [autoprefix]
  }))
  .pipe(gulp.dest(paths.build_css));
});

gulp.task('index', ['clean:build'], function() {
  gulp.src(paths.index)
  .pipe(jade({
    data: require(paths.project_data),
    pretty: true
  }))
  .pipe(gulp.dest(paths.build))
});

gulp.task('build', ['clean:build'], function() {
  gulp.src(paths.src_assets + '**/*')
  .pipe(gulp.dest(paths.build_assets))
});
