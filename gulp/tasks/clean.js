/* eslint-disable no-unused-vars */
const gulp = require('gulp')
const del = require('del')
const path = require('path')

module.exports = {
	clean
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
