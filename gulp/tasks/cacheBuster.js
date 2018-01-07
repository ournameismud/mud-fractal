const gulp = require('gulp')
const htmlreplace = require('gulp-html-replace')
const path = require('path')

module.exports = {
	cacheBusterTask
}

gulp.task('cacheBuster', cacheBusterTask)

function cacheBusterTask() {
	if (!PATH_CONFIG.tags) return

	const cms = '{% set stamp = "%s" %}'

	const production = {
		cms: {
			src: `.${TASK_CONFIG.stamp}`,
			tpl: cms
		}
	}

	const development = {
		cms: {
			src: '',
			tpl: cms
		}
	}

	const files = global.env === 'production' ? production : development

	return gulp
		.src(path.resolve(process.env.PWD, PATH_CONFIG.tags.src))
		.pipe(
			htmlreplace(files, {
				keepBlockTags: true
			})
		)
		.pipe(gulp.dest(path.resolve(process.env.PWD, PATH_CONFIG.tags.dest)))
}
