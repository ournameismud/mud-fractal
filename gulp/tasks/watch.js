const gulp = require('gulp')
const path = require('path')
const watch = require('gulp-watch')
const { getWatch } = require('../utils/tasks')
const tasks = require('./')
const util = require('gulp-util')

const serverTask =
	util.env.config === 'cms'
		? 'server:cms'
		: TASK_CONFIG.mode === 'fractal' ? 'server:fractal' : 'server:cms'

gulp.task('watch', [serverTask], watchTasks)

function watchTasks() {
	const { watchList } = getWatch()

	if (TASK_CONFIG.mode === 'fractal' && util.env.config === 'cms') {
		watchList.push('cms')
	}

	watchList.forEach(taskName => {
		const taskConfig = TASK_CONFIG[taskName]
		const taskPath = PATH_CONFIG[taskName]

		let watchConfig = {}
		if (
			TASK_CONFIG.watch !== undefined &&
			TASK_CONFIG.watch.gulpWatch !== undefined
		) {
			watchConfig = TASK_CONFIG.watch.gulpWatch
		}

		if (taskConfig) {
			const srcPath = path.resolve(
				process.env.PWD,
				PATH_CONFIG.src,
				taskPath.src
			)
			const globPattern =
				'**/*' +
				(taskConfig.extensions
					? '.{' + taskConfig.extensions.join(',') + '}'
					: '')
			const files =
				taskName === 'scss'
					? [
						path.resolve(process.env.PWD, PATH_CONFIG.src, taskPath.src),
						path.resolve(
							process.env.PWD,
							PATH_CONFIG.src,
							taskPath.components
						)
					]
					: path.join(srcPath, globPattern)

			watch(files, watchConfig, function() {
				tasks[`${taskName}`]()
			})
		}
	})
}
