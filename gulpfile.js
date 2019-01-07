‘use strict’;

// ----------------------------------------
// REQUIRED
// ----------------------------------------
var gulp = require('gulp'),
	sass = require('gulp-sass'),
	plumber = require('gulp-plumber'),
	sourcemaps = require('gulp-sourcemaps'),
	jshint = require('gulp-jshint'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
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
		.pipe(browserSync.stream()); // notify the browser of changes
});

//JS Hint task
gulp.task('jshint', function() {
	return gulp
		.src('source/javascripts/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'));
});

// Build JS
gulp.task('build-js', function() {
	return gulp
		.src(['node_modules/jquery/dist/jquery.min.js', 
			  'node_modules/bootstrap/dist/js/bootstrap.min.js',
			  'node_modules/jquery-match-height/dist/jquery.matchHeight-min.js',
			  'source/javascripts/**/*.js'])
		.pipe(sourcemaps.init()) // Process the original sources
		.pipe(plumber()) // Used to display error on Gulp Watch
		.pipe(concat('bundle.js'))
		.pipe(rename({ suffix: '.min' }))
		.pipe(uglify())
		//only uglify if gulp is ran with '--type production'
		// .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
		.pipe(sourcemaps.write()) // Add the map to modified source.
		.pipe(gulp.dest('public/javascripts/'))
		.pipe(browserSync.stream()); // notify the browser of changes
});

// ----------------------------------------
// WATCH TASKS
// ----------------------------------------
gulp.task('watch', ['build-css', 'jshint', 'build-js'], function() {
	browserSync.init({
		server: './source'
	});

	gulp.watch(['node_modules/bootstrap/scss/bootstrap.scss', 'source/sass/**/*.scss'], ['build-css']);
	gulp.watch('*.php').on('change', browserSync.reload);
});

// ----------------------------------------
// DEFAULT TASKS
// ----------------------------------------

// define the default task and add the watch task to it
gulp.task('default', ['watch']);