const gulp = require('gulp')
const svgmin = require('gulp-svgmin')
const browserSync = require('browser-sync')
const path = require('path')

module.exports = {
	svgs
}

gulp.task('svgs', svgs)

function svgs() {
	const paths = {
		src: path.resolve(
			process.env.PWD,
			PATH_CONFIG.src,
			PATH_CONFIG.svgs.src,
			'*.svg'
		),
		dest: path.resolve(
			process.env.PWD,
			PATH_CONFIG.public,
			PATH_CONFIG.svgs.dest
		)
	}

	return gulp
		.src(paths.src)
		.pipe(svgmin())
		.pipe(gulp.dest(paths.dest))
		.pipe(browserSync.stream())
}
