const browserSync = require('browser-sync')
const changed = require('gulp-changed')
const gulp = require('gulp')
const cssnano = require('gulp-cssnano')
const { getPaths } = require('../utils/paths')
const path = require('path')

module.exports = {
	fonts,
	cssFonts,
	favicons,
	json,
	staticAssets
}

gulp.task('fonts', fonts)
gulp.task('cssFonts', cssFonts)
gulp.task('favicons', favicons)
gulp.task('json', json)
gulp.task('staticAssets', staticAssets)

function fonts() {
	const paths = getPaths('fonts')

	return gulp
		.src(paths.src)
		.pipe(changed(paths.dest)) // Ignore unchanged files
		.pipe(gulp.dest(paths.dest))
		.pipe(browserSync.stream())
}

function favicons() {
	const paths = getPaths('favicons')

	return gulp
		.src(paths.src)
		.pipe(changed(paths.dest)) // Ignore unchanged files
		.pipe(gulp.dest(paths.dest))
		.pipe(browserSync.stream())
}

function json() {
	const paths = getPaths('json')

	return gulp
		.src(paths.entry)
		.pipe(gulp.dest(paths.dest))
		.pipe(browserSync.stream())
}

function cssFonts() {
	const paths = {
		src: path.resolve(
			process.env.PWD,
			PATH_CONFIG.src,
			PATH_CONFIG.cssFonts.src,
			'*.css'
		),
		dest: path.resolve(
			process.env.PWD,
			PATH_CONFIG.public,
			PATH_CONFIG.cssFonts.dest
		)
	}

	return gulp
		.src(paths.src)
		.pipe(
			cssnano({
				discardUnused: false
			})
		)
		.pipe(gulp.dest(paths.dest))
		.pipe(browserSync.stream())
}

function staticAssets() {
	// const paths = getPaths('staticAssets')

	const src = path.resolve(
		process.env.PWD,
		PATH_CONFIG.src,
		PATH_CONFIG.staticAssets.src,
		'*.*'
	)

	const dest = path.resolve(
		process.env.PWD,
		PATH_CONFIG.public,
		PATH_CONFIG.staticAssets.dest
	)

	return gulp
		.src(src)
		.pipe(changed(dest)) // Ignore unchanged files
		.pipe(gulp.dest(dest))
		.pipe(browserSync.stream())
}
