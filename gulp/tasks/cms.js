const gulp = require('gulp')
const browserSync = require('browser-sync')
const { getPaths } = require('../utils/paths')
const { fractalTemplates } = require('./fractal/utils')
const util = require('gulp-util')

module.exports = {
	cms
}

gulp.task('cms', cms)

function cms(cb) {
	if (TASK_CONFIG.mode === 'fractal' && util.env.config === 'cms') {
		return fractalTemplates()
			.then(() => {
				browserSync.reload()
			})
			.catch(err => console.log(err))
	} else {
		const paths = getPaths('cms')

		return gulp.src(paths.src).pipe(browserSync.stream())
	}
}
