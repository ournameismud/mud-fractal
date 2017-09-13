import gulp from 'gulp'
import sizereport from 'gulp-sizereport'
import gulpSequence from 'gulp-sequence'
import path from 'path'
import { getTasks } from '../libs/utils'
import fractal, { exportPaths } from './fractal'
import del from 'del'

gulp.task('size-report', function() {
	return gulp
		.src([
			path.resolve(process.env.PWD, PATH_CONFIG.dist, '**/*.css'),
			path.resolve(process.env.PWD, PATH_CONFIG.dist, '**/*.js'),
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
		// exportPaths().then(moveTwigTemplatesToCraft)
	})
}

function moveTwigTemplatesToCraft(resp) {
	for (const key in resp) {
		const { src, dest } = resp[key]

		gulp
			.src(path.resolve(process.env.PWD, src))
			.pipe(
				gulp.dest(
					path.resolve(process.env.PWD, PATH_CONFIG.craftTemplates.dest, dest)
				)
			)
	}
}

export function buildCode(cb) {
	const { assetTasks, codeTasks } = getTasks()
	assetTasks.push('move-scripts')
	codeTasks.push('bundle-script')
	gulpSequence('clean:dist', assetTasks, codeTasks, 'size-report', cb)
}

export function build(cb) {
	gulpSequence('build:fractal', 'build:code', cb)
}

gulp.task('build', build)
gulp.task('build:fractal', buildFractal)
gulp.task('build:code', buildCode)

gulp.task('clean:dist', () => {
	return del([path.resolve(process.env.PWD, PATH_CONFIG.dist)], {
		force: true
	})
})
