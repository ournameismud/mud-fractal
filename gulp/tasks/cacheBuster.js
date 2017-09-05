import gulp from 'gulp'
import htmlreplace from 'gulp-html-replace'

export function cacheBusterTask() {

	const cms = '{% set stamp = "%s" %}'

	const production = {
		'cms': {
			src: `.${TASK_CONFIG.stamp}`,
			tpl: cms
		}
	}

	const development = {
		'cms': {
			src: '',
			tpl: cms
		}
	}

	const files = global.production ? production : development

	return gulp.src(PATH_CONFIG.tags.src)
		.pipe(htmlreplace(files, {
			keepBlockTags: true
		}))
		.pipe(gulp.dest(PATH_CONFIG.tags.dest))
}

gulp.task('cacheBuster', cacheBusterTask)