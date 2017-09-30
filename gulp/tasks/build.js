import gulp from 'gulp'
import sizereport from 'gulp-sizereport'
import gulpSequence from 'gulp-sequence'
import rename from 'gulp-rename'
import gulpif from 'gulp-if'
import htmlmin from 'gulp-htmlmin'
import path from 'path'
import util from 'gulp-util'
import { getTasks } from '../libs/utils'
import fractal, { exportPaths } from './fractal'
import del from 'del'
import { twigTemplates } from './twig'

gulp.task('size-report', function() {
	return gulp
		.src([
			path.resolve(
				process.env.PWD,
				PATH_CONFIG.public,
				PATH_CONFIG.dist,
				'**/*.css'
			),
			path.resolve(
				process.env.PWD,
				PATH_CONFIG.public,
				PATH_CONFIG.dist,
				'**/*.js'
			),
			'*!rev-manifest.json'
		])
		.pipe(
			sizereport({
				gzip: true
			})
		)
})

function buildFractal() {
	const logger = fractal.cli.console
	const builder = fractal.web.builder()

	builder.on('progress', (completed, total) =>
		logger.update(`Exported ${completed} of ${total} items`, 'info')
	)
	builder.on('error', err => logger.error(err.message))
	return builder.build().then(() => {
		logger.success('Fractal build completed!')
		exportPaths().then(twigTemplates)
	})
}

export function buildCode(cb) {
	const { assetTasks, codeTasks } = getTasks()
	assetTasks.push('move-scripts')
	codeTasks.push('bundle-script')
	gulpSequence(
		'clean:dist',
		assetTasks,
		codeTasks,
		'cacheBuster',
		'critical',
		'size-report',
		cb
	)
}

export function buildCraft(cb) {
	const { assetTasks, codeTasks } = getTasks()
	assetTasks.push('move-scripts')
	codeTasks.push('bundle-script')
	gulpSequence('clean:dist', assetTasks, codeTasks, 'twig', 'size-report', cb)
}

export function build(cb) {
	BUILD_TYPE === 'fractal'
		? gulpSequence('build:fractal', 'build:code', cb)
		: gulpSequence('build:code', cb)
}

export function buildStatic(cb) {
	gulpSequence('clean:dist', 'move-html-files', 'move-dist-etc', cb)
}

gulp.task('move-html-files', () => {
	const { html, dist, templates, src } = PATH_CONFIG.publish
	html.forEach(({ input, name, dir }) => {
		gulp
			.src(path.resolve(process.env.PWD, src, templates, input))
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
				gulp.dest(path.resolve(process.env.PWD, dir ? `${dist}/${dir}` : dist))
			)
	})
})

gulp.task('move-dist-etc', () => {
	gulp
		.src([
			path.resolve(process.env.PWD, PATH_CONFIG.publish.src, 'dist/**'),
			path.resolve(process.env.PWD, PATH_CONFIG.publish.src, '!**.html')
		])
		.pipe(gulp.dest(path.resolve(process.env.PWD, PATH_CONFIG.publish.dist)))
})

gulp.task('build-component-map', () => {
	exportPaths()
})

gulp.task('build', build)
gulp.task('build:fractal', buildFractal)
gulp.task('build:code', buildCode)
gulp.task('build:static', buildStatic)
gulp.task('update:craft', buildCraft)

gulp.task('clean:dist', () => {
	return del(
		[path.resolve(process.env.PWD, PATH_CONFIG.public, PATH_CONFIG.dist)],
		{
			force: true
		}
	)
})
