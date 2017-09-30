import gulp from 'gulp'
import changed from 'gulp-changed'
import path from 'path'
import browserSync from 'browser-sync'
import gulpSequence from 'gulp-sequence'

export function twigTemplates(resp) {
	for (const key in resp) {
		const { src, dest } = resp[key]
		const d = path.resolve(
			process.env.PWD,
			PATH_CONFIG.craftTemplates.dest,
			dest
		)
		gulp
			.src(path.resolve(process.env.PWD, src))
			.pipe(changed(d))
			.pipe(gulp.dest(d))
			.pipe(browserSync.stream())
	}
}

function updateTwigTemplates() {
	const json = path.resolve(
		process.env.PWD,
		PATH_CONFIG.craftTemplates.config,
		'components-map.json'
	)

	twigTemplates(require(json))
}

function twig(cb) {
	return gulpSequence('updateTwigTemplates', 'critical', 'cacheBuster', cb)
}

gulp.task('updateTwigTemplates', updateTwigTemplates)
gulp.task('twig', twig)
