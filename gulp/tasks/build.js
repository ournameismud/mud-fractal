const gulp = require('gulp')
const gulpSequence = require('gulp-sequence')
const rename = require('gulp-rename')
const gulpif = require('gulp-if')
const htmlmin = require('gulp-htmlmin')
const util = require('gulp-util')
const path = require('path')
const { getTasks } = require('../utils/tasks')
const { sizeReport } = require('../utils/logs')
const { buildFractal } = require('./fractal/build')
const { fractalTemplates, exportPaths } = require('./fractal/utils')
const del = require('del')
const { critialCss } = require('./critical')
const { fractal } = require('./fractal')
const { purge } = require('./purge')
const { cleanFractal } = require('./clean')
const { validateHtml } = require('./htmlhint')

function buildCode(cb) {
	const { assetTasks, codeTasks } = getTasks()
	codeTasks.push('bundle-script')
	codeTasks.push('move-scripts')
	return new Promise(resolve => {
		gulpSequence(
			'clean:dist',
			assetTasks,
			codeTasks,
			'cacheBuster',
			'size-report',
			resolve
		)
	})
}

function cleanPartials() {
	return del(
		[
			path.resolve(
				process.env.PWD,
				PATH_CONFIG.fractal.base,
				PATH_CONFIG.fractal.output,
				'**'
			),
			`!${path.resolve(
				process.env.PWD,
				PATH_CONFIG.fractal.base,
				PATH_CONFIG.fractal.output
			)}`
		],
		{
			force: true
		}
	)
}

function build(cb) {
	if (TASK_CONFIG.mode === 'fractal') {
		if (util.env.config === 'cms') {
			return cleanPartials()
				.then(buildCode)
				.then(purge)
				.then(sizeReport)
				.then(() => {
					validateHtml()
				})
		}
		return buildFractal()
			.then(buildCode)
			.then(purge)
			.then(sizeReport)
			.then(() => {
				validateHtml()
			})
	}
	return buildCode(cb)
}

function production(cb) {
	if (TASK_CONFIG.mode === 'fractal') {
		if (util.env.config === 'cms') {
			return (
				buildCode(cb)
					// .then(cleanPartials)
					// .then(fractalTemplates)
					.then(() => purge())
					.then(critialCss)
					.then(sizeReport)
			)
		}
		return (
			buildFractal()
				.then(buildCode)
				.then(purge)
				// .then(critialCss)
				.then(sizeReport)
		)
	}
	return buildCode(cb)
}

function publish(cb) {
	build(cb)
		.then(() => {
			const { html, src } = PATH_CONFIG.publish
			return Promise.all(
				html.map(
					({ template, name, output }) =>
						new Promise(resolve =>
							gulp
								.src(path.resolve(process.env.PWD, src, template))
								.pipe(
									gulpif(
										typeof name !== 'undefined',
										rename({
											basename: name
										})
									)
								)
								.pipe(htmlmin({ collapseWhitespace: true }))
								.pipe(
									gulp.dest(
										path.resolve(
											process.env.PWD,
											PATH_CONFIG.public,
											'_tmp',
											output
										)
									)
								)
								.on('finish', resolve)
						)
				)
			)
		})
		.then(() => cleanFractal())
		.then(
			() =>
				new Promise(resolve => {
					gulp
						.src(path.resolve(process.env.PWD, PATH_CONFIG.public, '_tmp/**'))
						.pipe(gulp.dest(path.resolve(process.env.PWD, PATH_CONFIG.public)))
						.on('finish', resolve)
				})
		)
		.then(() =>
			del([path.resolve(process.env.PWD, PATH_CONFIG.public, '_tmp/**')], {
				force: true
			})
		)
		.then(() => {
			gulp
				.src(path.resolve(process.env.PWD, PATH_CONFIG.public, '**/*'))
				.pipe(
					gulp.dest(path.resolve(process.env.PWD, PATH_CONFIG.publish.public))
				)
		})
}

function buildComponentMap() {
	const server = fractal.web.server()
	const logger = fractal.cli.console
	return server.start().then(() => {
		logger.success(
			'Fractal server is alive and well, components being built and json map being generated'
		)
		del(
			[
				path.resolve(
					process.env.PWD,
					PATH_CONFIG.fractal.base,
					PATH_CONFIG.fractal.output,
					'**'
				),
				`!${path.resolve(
					process.env.PWD,
					PATH_CONFIG.fractal.base,
					PATH_CONFIG.fractal.output
				)}`
			],
			{
				force: true
			}
		).then(() => {
			exportPaths(fractal)
				.catch(err => console.log(err))
				.then(fractalTemplates)
				.then(() => {
					server.stop()
					process.exit()
				})
		})
	})
}

gulp.task('build', build)
gulp.task('production', production)
gulp.task('publish', publish)
gulp.task('build:component-map', buildComponentMap)