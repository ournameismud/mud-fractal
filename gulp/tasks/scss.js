const gulp = require('gulp')
const rename = require('gulp-rename')
const sass = require('gulp-sass')
const sassGlob = require('gulp-sass-glob')
const sourcemaps = require('gulp-sourcemaps')
const autoprefixer = require('autoprefixer')
const postcss = require('gulp-postcss')
const cssnano = require('gulp-cssnano')
const gulpif = require('gulp-if')
const inlineSVG = require('postcss-inline-svg')
const writeSVG = require('postcss-write-svg')
const aspectRatio = require('postcss-aspect-ratio')
const animateCss = require('postcss-animation')
const postcssTriangle = require('postcss-triangle')
const objectFitImages = require('postcss-object-fit-images')
const styleLint = require('gulp-stylelint')
const rucksack = require('rucksack-css')
const gradients = require('postcss-easing-gradients')
const sassVariables = require('gulp-sass-variables')
const browserSync = require('browser-sync')
const { handleErrors } = require('../utils/logs')
const tailwindcss = require('tailwindcss')
const path = require('path')
const util = require('gulp-util')

module.exports = {
	scss
}

gulp.task('scss', scss)

function scss() {
	const base = path.resolve(
		process.env.PWD,
		PATH_CONFIG.src,
		PATH_CONFIG.scss.src
	)

	const paths = {
		src: path.resolve(base, '**/**/*.scss'),
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

	const plugins = [
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
		gradients(),
		tailwindcss(`${base}/tailwind.config.js`),
		autoprefixer(TASK_CONFIG.scss.autoprefixer)
	]

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
				$env: PRODUCTION ? 'production' : util.env.test ? 'test' : 'development'
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
		.pipe(postcss(plugins))
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
