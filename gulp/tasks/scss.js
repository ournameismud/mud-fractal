import gulp from 'gulp'
import rename from 'gulp-rename'
import sass from 'gulp-sass'
import sassGlob from 'gulp-sass-glob'
import sourcemaps from 'gulp-sourcemaps'
import autoprefixer from 'autoprefixer'
import postcss from 'gulp-postcss'
import cssnano from 'gulp-cssnano'
import gulpif from 'gulp-if'
import inlineSVG from 'postcss-inline-svg'
import writeSVG from 'postcss-write-svg'
import aspectRatio from 'postcss-aspect-ratio'
import animateCss from 'postcss-animation'
import postcssTriangle from 'postcss-triangle'
import objectFitImages from 'postcss-object-fit-images'
import styleLint from 'gulp-stylelint'
import rucksack from 'rucksack-css'
import sassVariables from 'gulp-sass-variables'
import browserSync from 'browser-sync'
import { handleErrors } from '../libs/utils'
import path from 'path'
import util from 'gulp-util'

export function scss() {
	const paths = {
		src: path.resolve(
			process.env.PWD,
			PATH_CONFIG.src,
			PATH_CONFIG.scss.src,
			'**/**/*.scss'
		),
		components: path.resolve(
			process.env.PWD,
			PATH_CONFIG.src,
			PATH_CONFIG.scss.components
		),
		dest: path.resolve(
			process.env.PWD,
			PATH_CONFIG.public,
			PATH_CONFIG.scss.dest
		),
		svg: path.resolve(
			process.env.PWD,
			PATH_CONFIG.src,
			PATH_CONFIG.scss.inlineSVG
		)
	}

	return gulp
		.src([paths.src, paths.components])
		.pipe(
			styleLint({
				debug: true,
				failAfterError: false,
				syntax: 'scss',
				reporters: [
					{
						formatter: 'string',
						console: true
					}
				]
			})
		)
		.on('error', handleErrors)
		.pipe(gulpif(!PRODUCTION, sourcemaps.init()))
		.pipe(sassGlob())
		.pipe(
			sassVariables({
				$env: PRODUCTION
					? 'production'
					: util.env.test ? 'test' : 'development'
			})
		)
		.pipe(
			sass({
				...TASK_CONFIG.scss.options,
				includePaths: [
					path.resolve(process.env.PWD, 'node_modules/normalize-scss/sass'),
					path.resolve(process.env.PWD, 'node_modules/susy/sass')
				]
			})
		)
		.on('error', handleErrors)
		.pipe(
			gulpif(
				!PRODUCTION,
				sourcemaps.init({
					loadMaps: true
				})
			)
		)
		.pipe(
			postcss([
				rucksack(),
				objectFitImages(),
				animateCss(),
				aspectRatio(),
				postcssTriangle(),
				inlineSVG({
					path: paths.svg
				}),
				writeSVG({
					encoding: 'base64'
				}),
				autoprefixer(TASK_CONFIG.scss.autoprefixer)
			])
		)
		.on('error', handleErrors)
		.pipe(gulpif(PRODUCTION, cssnano(TASK_CONFIG.scss.cssnanoOptions)))
		.pipe(gulpif(!PRODUCTION, sourcemaps.write()))
		.pipe(
			gulpif(
				PRODUCTION,
				rename({
					suffix: `.${TASK_CONFIG.stamp}`
				})
			)
		)
		.pipe(gulp.dest(paths.dest))
		.pipe(browserSync.stream())
}

gulp.task('scss', scss)
