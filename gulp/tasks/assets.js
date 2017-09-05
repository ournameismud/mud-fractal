import browserSync from 'browser-sync'
import changed from 'gulp-changed'
import gulp from 'gulp'
import cssnano from 'gulp-cssnano'
import { getPaths } from '../libs/utils'
import path from 'path'

export function fonts () {
	const paths = getPaths('fonts')

	return gulp.src(paths.src)
		.pipe(changed(paths.dest)) // Ignore unchanged files
		.pipe(gulp.dest(paths.dest))
		.pipe(browserSync.stream())
}

export function favicons () {
	const paths = getPaths('favicons')
	
	return gulp.src(paths.src)
		.pipe(changed(paths.dest)) // Ignore unchanged files
		.pipe(gulp.dest(paths.dest))
		.pipe(browserSync.stream())
}

export function moveScripts () {

	const src = PATH_CONFIG.js.libs.map((lib) => {
		return path.resolve(process.env.PWD, lib)
	})

	const dest = path.resolve(process.env.PWD, PATH_CONFIG.dest, PATH_CONFIG.js.dest)

	return gulp.src(src)
		.pipe(gulp.dest(dest))
		.pipe(browserSync.stream())
}

export function json () {

	const paths = getPaths('json')

	return gulp.src(paths.entry)
		.pipe(gulp.dest(paths.dest))
		.pipe(browserSync.stream())
}


export function cssFonts () {

	const paths = {
		src: path.resolve(process.env.PWD, PATH_CONFIG.src, PATH_CONFIG.cssFonts.src, '*.css'),
		dest: path.resolve(process.env.PWD, PATH_CONFIG.dest, PATH_CONFIG.cssFonts.dest)
	}

	return gulp.src(paths.src)
		.pipe(cssnano({
			discardUnused: false
		}))
		.pipe(gulp.dest(paths.dest))
		.pipe(browserSync.stream())
}

export function staticAssets() {
	const paths = getPaths('static')

	return gulp.src(paths.src)
		.pipe(changed(paths.dest)) // Ignore unchanged files
		.pipe(gulp.dest(paths.dest))
		.pipe(browserSync.stream())
}

gulp.task('fonts', fonts)
gulp.task('cssFonts', cssFonts)
gulp.task('favicons', favicons)
gulp.task('move-scripts', moveScripts)
gulp.task('json', json)
gulp.task('staticAssets', staticAssets)