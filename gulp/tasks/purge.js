const gulp = require('gulp')
const purgecss = require('gulp-purgecss')
const purgeHtml = require('purge-from-html')
// const purgeJs = require('purgecss-from-js')
const path = require('path')

class TailwindExtractor {
	static extract(content) {
		return content.match(/[A-z0-9-:\/]+/g) || []
	}
}

function purge() {
	const build = path.resolve(
		process.env.PWD,
		PATH_CONFIG.public,
		PATH_CONFIG.dist
	)

	const html = path.resolve(process.env.PWD, 'src', 'templates/**/**', '*.twig')
	const js = path.resolve(process.env.PWD, 'src/js/**/**/*.js')

	return new Promise((resolve, reject) => {
		gulp
			.src(path.resolve(build, `css/style.${TASK_CONFIG.stamp}.css`))
			.pipe(
				purgecss({
					content: [html, js],
					extractors: [
						{
							extractor: TailwindExtractor,
							extensions: ['twig', 'js']
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

module.exports = {
	purge
}

gulp.task('purge', purge)
