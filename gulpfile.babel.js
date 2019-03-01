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
import del from 'del';

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
		.pipe(gulp.dest('dist/stylesheets/'));
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
		.pipe(gulpif(PRODUCTION, uglify()))
		// .pipe(uglify())
		//only uglify if gulp is ran with '--type production'
		// .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
		.pipe(sourcemaps.write()) // Add the map to modified source.
		.pipe(gulp.dest('dist/javascripts/'));
});

// Image compressions
gulp.task('imageCompressions', function() {
	return gulp
		.src('source/images/**/*.{jpg,jpeg,png,svg,gif}')
		.pipe(gulpif(PRODUCTION, imagemin()))
    	.pipe(gulp.dest('dist/images'));
});

// Task to sync 'source' and 'dist' folder
gulp.task('syncFolder', function() {
	return gulp
		.src(
			[
				'source/**/*',
				'!source/{images,js,scss}',
				'!source/{images,js,scss}/**/*'
			]
		)
		.pipe(gulp.dest('dist'));
});

gulp.task('cleanDist', function() {
	return del(['dist']);
});	

// ----------------------------------------
// WATCH TASKS
// ----------------------------------------
gulp.task('watch', function() {
	gulp.watch(
		[
			'node_modules/bootstrap/scss/bootstrap.scss', 
			'source/sass/**/*.scss'
		], 
		gulp.series('buildCSS')
	);
	gulp.watch(
		[
			'node_modules/jquery/dist/jquery.min.js', 
		 	'node_modules/bootstrap/dist/js/bootstrap.min.js',
		 	'node_modules/jquery-match-height/dist/jquery.matchHeight-min.js',
		 	'source/javascripts/**/*.js'
		],
		gulp.series('jsHint', 'buildJs')
	);
	gulp.watch(
		[
			'source/images/**/*.{jpg,jpeg,png,svg,gif}'
		],
		gulp.series('imageCompressions')
	);
	gulp.watch(
		[
			'source/**/*',
			'!source/{images,js,scss}',
			'!source/{images,js,scss}/**/*'
		],
		gulp.series('syncFolder')
	);
});

// ----------------------------------------
// SERVE TASKS
// ----------------------------------------
// gulp.task('serve', gulp.series(gulp.parallel('buildCSS', 'jsHint', 'buildJs')), function serve () {
// 	gulp.watch(['node_modules/bootstrap/scss/bootstrap.scss', 'source/sass/**/*.scss'], ['buildCSS']);
// });

// ----------------------------------------
// DEFAULT TASKS
// ----------------------------------------

// define the default task and add the watch task to it
gulp.task('default', gulp.series(gulp.parallel('watch')));