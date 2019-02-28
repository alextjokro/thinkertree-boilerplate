'use strict';

// ----------------------------------------
// IMPORTS/REQUIRED
// ----------------------------------------

import gulp from 'gulp';
import sass from 'gulp-sass';
import postcss from 'gulp-postcss';
import plumber from 'gulp-plumber';
import rev from 'gulp-rev';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'autoprefixer';
import cleanCSS from 'gulp-clean-css'; // to minify CSS
import gulpif from 'gulp-if'; // to setup custom conditionals
import jshint from 'gulp-jshint';
import stylish from 'jshint-stylish';
import concat from 'gulp-concat';
import rename from 'gulp-rename';
import uglify from 'gulp-uglify';
// browserSync = require('browser-sync').create(); // will setup a static server and reload browser as we save files

import yargs from 'yargs';
const PRODUCTION = yargs.argv.prod;

// ----------------------------------------
// SCRIPT TASKS
// ----------------------------------------

// Build CSS/Sass/SCSS
gulp.task('buildCSS', function() {
	return gulp
		.src(['node_modules/bootstrap/scss/bootstrap.scss',
			  'source/sass/**/*.scss'])
		.pipe(sourcemaps.init()) // Process the original sources
		.pipe(plumber()) // Used to display error on Gulp Watch
		.pipe(sass().on('error', sass.logError))
		// .pipe(rev())
		.pipe(gulpif(PRODUCTION, postcss([ autoprefixer ])))
		.pipe(gulpif(PRODUCTION, cleanCSS({compatibility:'ie8'}))) // minify CSS only in PROD mode
		.pipe(sourcemaps.write()) // Add the map to modified source.
		.pipe(gulp.dest('dist/stylesheets/'))
		// .pipe(browserSync.stream()); // notify the browser of changes
});

//JS Hint task
gulp.task('jsHint', function() {
	return gulp
		.src('source/javascripts/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter(stylish));
});

// Build JS
gulp.task('buildJs', function() {
	return gulp
		.src(['node_modules/jquery/dist/jquery.min.js', 
			  'node_modules/bootstrap/dist/js/bootstrap.min.js',
			  'node_modules/jquery-match-height/dist/jquery.matchHeight-min.js',
			  'source/javascripts/**/*.js'])
		.pipe(sourcemaps.init()) // Process the original sources
		.pipe(plumber()) // Used to display error on Gulp Watch
		.pipe(concat({path: 'bundle.js', cwd: ''}))
		.pipe(rename({ suffix: '.min' }))
		.pipe(uglify())
		//only uglify if gulp is ran with '--type production'
		// .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
		.pipe(sourcemaps.write()) // Add the map to modified source.
		.pipe(gulp.dest('dist/javascripts/'))
		// .pipe(browserSync.stream()); // notify the browser of changes
});

// ----------------------------------------
// SERVE TASKS
// ----------------------------------------
gulp.task('serve', gulp.series(gulp.parallel('buildCSS', 'jsHint', 'buildJs')), function serve () {
	// browserSync.init({
	// 	server: './source'
	// });

	gulp.watch(['node_modules/bootstrap/scss/bootstrap.scss', 'source/sass/**/*.scss'], ['buildCSS']);
	// gulp.watch('*.php').on('change', browserSync.reload);
});

// ----------------------------------------
// DEFAULT TASKS
// ----------------------------------------

// define the default task and add the watch task to it
gulp.task('default', gulp.series(gulp.parallel('serve')));