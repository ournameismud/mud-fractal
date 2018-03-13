const gulp = require('gulp')
const purgecss = require('gulp-purgecss')
const purgeHtml = require('purge-from-html')
const purgeJs = require('purgecss-from-js')
const path = require('path')

module.exports = {
	purge
}

gulp.task('purge', purge)

function purge() {
	const build = path.resolve(
		process.env.PWD,
		PATH_CONFIG.public,
		PATH_CONFIG.dist
	)

	const html = path.resolve(
		process.env.PWD,
		PATH_CONFIG.src,
		PATH_CONFIG.fractal.src,
		'**/**/*.twig'
	)

	return new Promise((resolve, reject) => {
		gulp
			.src(path.resolve(build, `css/style.${TASK_CONFIG.stamp}.css`))
			.pipe(
				purgecss({
					content: [html],
					extractors: [
						{
							extractor: purgeHtml,
							extensions: ['twig']
						}
					],
					whitelistPatterns: TASK_CONFIG.purge.whitelistPatterns
				})
			)
			.on('error', reject)
			.pipe(gulp.dest(`${build}/css`))
			.on('end', () => {
				resolve()
			})
	})
}
