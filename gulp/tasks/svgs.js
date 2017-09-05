import gulp from 'gulp'
import svgmin from 'gulp-svgmin'
import browserSync from 'browser-sync'
import path from 'path'

export function svgs() {

	const paths = {
		src: path.resolve(process.env.PWD, PATH_CONFIG.src, PATH_CONFIG.svgs.src, '*.svg'),
		dest: path.resolve(process.env.PWD, PATH_CONFIG.dest, PATH_CONFIG.svgs.dest)
	}

	return gulp.src(paths.src)
		.pipe(svgmin())
		.pipe(gulp.dest(paths.dest))
		.pipe(browserSync.stream())
}


gulp.task('svgs', svgs)