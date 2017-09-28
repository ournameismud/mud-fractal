import gulp from 'gulp'
import webpack from 'webpack'
import inject from 'gulp-inject'
import { logger } from '../libs/utils'
import webpackConfig from './webpack.config.babel'
import babel from 'gulp-babel'
import uglify from 'gulp-uglify'
import gulpif from 'gulp-if'
import browserSync from 'browser-sync'
import path from 'path'
import util from 'gulp-util'

export function webpackProduction(callback) {
	const config = webpackConfig(global.env)
	webpack(config, function(err, stats) {
		logger(err, stats)
		callback()
	})
}
export function inlineScripts() {
	return gulp
		.src(`${PATH_CONFIG.inline.path}/${PATH_CONFIG.inline.output}`)
		.pipe(
			inject(gulp.src(PATH_CONFIG.inline.src).pipe(uglify()), {
				transform: function(filepath, file) {
					return `<script>${file.contents.toString()}</script>`
				}
			})
		)
		.pipe(gulp.dest(PATH_CONFIG.inline.path))
}

export function serviceWorker() {
	const STAMP = PRODUCTION ? `.${TASK_CONFIG.stamp}` : ''
	return gulp
		.src(path.resolve(PATH_CONFIG.src, PATH_CONFIG.serviceWorker.src, 'sw.js'))
		.pipe(
			babel({
				plugins: [
					[
						'inline-replace-variables',
						{
							__CSS__: `/dist/css/style${STAMP}.css`,
							__JS__: `/dist/js/bundle${STAMP}.js`
						}
					]
				]
			})
		)
		.pipe(gulpif(PRODUCTION, uglify()))
		.pipe(
			gulp.dest(
				path.resolve(PATH_CONFIG.public, PATH_CONFIG.serviceWorker.dest)
			)
		)
		.pipe(browserSync.stream())
}

gulp.task('serviceWorker', serviceWorker)
gulp.task('inline-scripts', inlineScripts)
gulp.task('bundle-script', webpackProduction)
