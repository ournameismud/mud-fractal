const changed = require('gulp-changed')
const gulp = require('gulp')
const imagemin = require('gulp-imagemin')
const browserSync = require('browser-sync')
const { getPaths } = require('../utils/paths')

module.exports = {
	images
}

function images() {
	const paths = getPaths('images')

	return gulp
		.src(paths.src)
		.pipe(changed(paths.dest))
		.pipe(imagemin())
		.pipe(gulp.dest(paths.dest))
		.pipe(browserSync.stream())
}

gulp.task('images', images)
