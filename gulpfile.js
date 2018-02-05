var gulp = require("gulp");
var gutil = require('gulp-util');

require("./tasks/deploy.js");

gulp.task('default', function() {
	gutil.log(gutil.colors.cyan("Deployement Tool:"));
	gutil.log(gutil.colors.cyan("	- deploy --target <remote> --environment <env> (deploys to a target remote server with a target environment)"));
});
