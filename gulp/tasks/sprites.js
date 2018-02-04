const gulp = require('gulp')
const svgmin = require('gulp-svgmin')
const svgSprite = require('gulp-svg-sprite')
const browserSync = require('browser-sync')
const path = require('path')

module.exports = {
	sprites
}

gulp.task('sprites', sprites)

function sprites() {
	const { dest, template } = TASK_CONFIG.sprites.mode.css.render.scss
	const paths = {
		src: path.resolve(
			process.env.PWD,
			PATH_CONFIG.src,
			PATH_CONFIG.sprites.src,
			'*.svg'
		),
		dest: path.resolve(
			process.env.PWD,
			PATH_CONFIG.public,
			PATH_CONFIG.sprites.dest
		)
	}

	TASK_CONFIG.sprites.mode.css.render.scss.dest = `/src/${PATH_CONFIG.scss
		.src}/${dest}`
	TASK_CONFIG.sprites.mode.css.render.scss.template = path.resolve(
		process.env.PWD,
		template
	)

	return gulp
		.src(paths.src)
		.pipe(svgmin())
		.pipe(svgSprite(TASK_CONFIG.sprites))
		.pipe(gulp.dest(paths.dest))
		.pipe(browserSync.stream())
}
