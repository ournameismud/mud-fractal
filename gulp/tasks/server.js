import browserSync from 'browser-sync'
import gulp from 'gulp'

gulp.task('server', () => {
	browserSync.init({
		...SERVER,
		...TASK_CONFIG.server
	})
})
