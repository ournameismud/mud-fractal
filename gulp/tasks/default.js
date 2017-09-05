import gulp from 'gulp'
import gulpSequence from 'gulp-sequence'
import { getTasks } from '../libs/utils'

export default function defaultTask (cb) {

	const { assetTasks, codeTasks } = getTasks()
	assetTasks.push('move-scripts')
	assetTasks.push('inline-scripts')
	gulpSequence('clean', assetTasks, codeTasks, 'cacheBuster', 'watch', cb)
}

gulp.task('default', defaultTask)
