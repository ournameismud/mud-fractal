import gulp from 'gulp'
import svgmin from 'gulp-svgmin'
import svgSprite from 'gulp-svg-sprite'
import browserSync from 'browser-sync'
import path from 'path'

export function sprites() {

	const { dest, template } = TASK_CONFIG.sprites.mode.css.render.scss
	const paths = {
		src: path.resolve(process.env.PWD, PATH_CONFIG.src, PATH_CONFIG.sprites.src, '*.svg'),
		dest: path.resolve(process.env.PWD, PATH_CONFIG.dest, PATH_CONFIG.sprites.dest)
	}

	TASK_CONFIG.sprites.mode.css.render.scss.dest = `/_assets/${PATH_CONFIG.scss.src}/${dest}`
	TASK_CONFIG.sprites.mode.css.render.scss.template = path.resolve(process.env.PWD, template)

	return gulp.src(paths.src)
		.pipe(svgmin())
		.pipe(svgSprite(TASK_CONFIG.sprites))
		.pipe(gulp.dest(paths.dest))
		.pipe(browserSync.stream())
}

gulp.task('sprites', sprites)
