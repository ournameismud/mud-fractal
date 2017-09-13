/* eslint-disable no-unused-vars */
import gulp from 'gulp'
import del from 'del'
import path from 'path'

export function clean() {
	return del(
		[
			path.resolve(process.env.PWD, PATH_CONFIG.dest, '*.html'),
			path.resolve(process.env.PWD, PATH_CONFIG.dist)
		],
		{
			force: true
		}
	)
}

gulp.task('clean', clean)
