‘use strict’;

// ----------------------------------------
// REQUIRED
// ----------------------------------------
var gulp = require('gulp'),
	sass = require('gulp-sass'),
	plumber = require('gulp-plumber'),
	sourcemaps = require('gulp-sourcemaps'),
	browserSync = require('browser-sync').create(); // will setup a static server and reload browser as we save files

// ----------------------------------------
// SCRIPT TASKS
// ----------------------------------------

// Build CSS/Sass/SCSS
gulp.task('build-css', function() {
	return gulp
		.src(['node_modules/bootstrap/scss/bootstrap.scss',
			  'source/sass/**/*.scss'])
		.pipe(sourcemaps.init()) // Process the original sources
		.pipe(plumber()) // Used to display error on Gulp Watch
		.pipe(sass().on('error', sass.logError))
		.pipe(sourcemaps.write()) // Add the map to modified source.
		.pipe(gulp.dest('public/stylesheets/'))
		.pipe(browserSync.stream()) // notify the browser of changes
});

// ----------------------------------------
// WATCH TASKS
// ----------------------------------------
gulp.task('watch', function() {
	gulp.watch('source/sass/**/*.scss', ['build-css']);
});