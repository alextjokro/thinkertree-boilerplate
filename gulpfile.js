‘use strict’;

// ----------------------------------------
// REQUIRED
// ----------------------------------------
var gulp = require('gulp'),
	sass = require('gulp-sass'),
	plumber = require('gulp-plumber'),
	sourcemaps = require('gulp-sourcemaps');

// ----------------------------------------
// SCRIPT TASKS
// ----------------------------------------

// Build CSS/Sass/SCSS
gulp.task('build-css', function() {
	return gulp
		.src('source/sass/**/*.scss')
		.pipe(sourcemaps.init()) // Process the original sources
		.pipe(plumber()) // Used to display error on Gulp Watch
		.pipe(sass().on('error', sass.logError))
		.pipe(sourcemaps.write()) // Add the map to modified source.
		.pipe(gulp.dest('public/stylesheets/'));
});