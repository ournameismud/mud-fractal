/* eslint-disable no-unused-vars */
const gulp = require('gulp')
const del = require('del')
const path = require('path')
const util = require('gulp-util')

module.exports = {
	clean,
	cleanFractal
}

gulp.task('clean', clean)

function clean() {
	return del(
		[
			path.resolve(process.env.PWD, PATH_CONFIG.public, '*.html'),
			path.resolve(process.env.PWD, PATH_CONFIG.public, PATH_CONFIG.dist)
		],
		{
			force: true
		}
	)
}

gulp.task('clean:dist', () => {
	return del(
		[path.resolve(process.env.PWD, PATH_CONFIG.public, PATH_CONFIG.dist)],
		{
			force: true
		}
	)
})

function cleanFractal() {
	util.log('clean fractal')
	const build = path.resolve(process.env.PWD, PATH_CONFIG.fractal.build)
	return del(
		[
			path.resolve(build, '*.html'),
			path.resolve(build, 'components/**/**'),
			path.resolve(build, 'docs/**/**'),
			path.resolve(build, 'fractal/**/**')
		],
		{
			force: true
		}
	)
}
