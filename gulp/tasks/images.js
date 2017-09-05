import changed from 'gulp-changed'
import gulp from 'gulp'
import imagemin from 'gulp-imagemin'
import browserSync from 'browser-sync'
import { getPaths } from '../libs/utils'


export function images() {

	const paths = getPaths('images')
	
	return gulp.src(paths.src)
		.pipe(changed(paths.dest))
		.pipe(imagemin())
		.pipe(gulp.dest(paths.dest))
		.pipe(browserSync.stream())
}



gulp.task('images', images)