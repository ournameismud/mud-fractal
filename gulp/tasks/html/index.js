const gulp = require('gulp')
const data = require('gulp-data')
const render = require('gulp-twig')
const browserSync = require('browser-sync')
const gulpif = require('gulp-if')
const htmlmin = require('gulp-htmlmin')
const htmlbeautify = require('gulp-html-beautify')
const path = require('path')
const fs = require('fs')
const { getPaths } = require('../../utils/paths')
const { handleErrors } = require('../../utils/logs')

module.exports = {
	html
}

gulp.task('html', html)

function html() {
	const stamp = global.production ? `.${TASK_CONFIG.stamp}` : ''

	const exclude =
		'!' +
		path.resolve(
			process.env.PWD,
			PATH_CONFIG.src,
			PATH_CONFIG.html.src,
			'**/{' + TASK_CONFIG.html.excludeFolders.join(',') + '}/**'
		)

	const paths = getPaths('html')
	const src = [...paths.src, exclude]

	const getData =
		TASK_CONFIG.html.getData ||
		function() {
			const dataPath = path.resolve(
				process.env.PWD,
				PATH_CONFIG.src,
				PATH_CONFIG.html.data
			)
			return { ...JSON.parse(fs.readFileSync(dataPath, 'utf8')), stamp }
		}

	return gulp
		.src(src)
		.pipe(data(getData))
		.on('error', handleErrors)
		.pipe(
			render({
				base: [
					path.resolve(process.env.PWD, PATH_CONFIG.src, PATH_CONFIG.html.src)
				],
				debug: false
			})
		)
		.on('error', handleErrors)
		.pipe(
			gulpif(
				global.production,
				htmlmin({
					collapseWhitespace: true,
					removeComments: false
				})
			)
		)
		.pipe(
			gulpif(
				!global.production,
				htmlbeautify({
					indent_with_tabs: true
				})
			)
		)
		.pipe(gulp.dest(paths.dest))
		.pipe(browserSync.stream())
}
