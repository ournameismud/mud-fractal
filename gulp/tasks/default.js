const gulp = require('gulp')
const gulpSequence = require('gulp-sequence')
const { getTasks } = require('../utils/tasks')

module.exports = {
	defaultTask
}

gulp.task('default', defaultTask)

function defaultTask(cb) {
	const { assetTasks, codeTasks } = getTasks()
	assetTasks.push('move-scripts')
	assetTasks.push('inline-scripts')
	gulpSequence(
		'clean',
		assetTasks,
		codeTasks,
		'tokens',
		'cacheBuster',
		'watch',
		cb
	)
}
