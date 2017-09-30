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

function buildTwig(cb) {
	return gulpSequence('updateTwigTemplates', 'critical', 'cacheBuster', cb)
}

gulp.task('updateTwigTemplates', updateTwigTemplates)

export function twig() {
	const paths = {
		src: path.resolve(
			process.env.PWD,
			PATH_CONFIG.src,
			PATH_CONFIG.twig.src,
			'**/**/*.twig'
		),
		dest: path.resolve(process.env.PWD, PATH_CONFIG.twig.dest)
	}

	return gulp
		.src(paths.src)
		.pipe(changed(paths.dest))
		.pipe(gulp.dest(paths.dest))
		.pipe(browserSync.stream())
}

gulp.task('twig', twig)
gulp.task('build:twig', buildTwig)
