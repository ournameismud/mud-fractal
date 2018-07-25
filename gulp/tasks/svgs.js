const gulp = require('gulp')
const svgmin = require('gulp-svgmin')
const browserSync = require('browser-sync')
const path = require('path')

function optimiseSVGS(src, dest) {
	return gulp
		.src(src)
		.pipe(svgmin())
		.pipe(gulp.dest(dest))
		.pipe(browserSync.stream())
}

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

	optimiseSVGS(paths.src, paths.dest)
}

function inlineSvgs() {
	const src = path.resolve(
		process.env.PWD,
		PATH_CONFIG.src,
		PATH_CONFIG.inlineSvgs.src,
		'*.svg'
	)

	optimiseSVGS(src, PATH_CONFIG.inlineSvgs.dest)
}

module.exports = {
	svgs,
	inlineSvgs
}

gulp.task('svgs', svgs)
gulp.task('inlineSvgs', inlineSvgs)
