import browserSync from 'browser-sync'
import gulp from 'gulp'
import { getPaths } from '../libs/utils'


export function craftTemplates() {
	const paths = getPaths('craftTemplates')

	return gulp.src(paths.src)
		.pipe(browserSync.stream())
}

gulp.task('craftTemplates', craftTemplates)