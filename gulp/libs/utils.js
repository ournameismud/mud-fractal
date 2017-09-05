
/* eslint-disable no-unused-vars */
import path from 'path'
import notify from 'gulp-notify'
import gutil from 'gulp-util'

export function handleErrors(errorObject, callback) {
	notify.onError(errorObject.toString().split(': ').join(':\n')).apply(this, arguments)
	// Keep gulp from hanging on this task
	if(typeof this.emit === 'function') this.emit('end')
}

export function pathToUrl() {
	// Normalizes Windows file paths to valid url paths
	return path.join.apply(this, arguments).replace(/\\/g, '/')
}

export function getPaths(type) {
	return {
		src: [path.resolve(process.env.PWD, PATH_CONFIG.src, PATH_CONFIG[type].src, '**/*.{' + TASK_CONFIG[type].extensions +
			'}')],
		entry: [path.resolve(process.env.PWD, PATH_CONFIG.src, PATH_CONFIG[type].src, `*.${type}`)],
		dest: path.resolve(process.env.PWD, PATH_CONFIG.dest, PATH_CONFIG[type].dest),
	}
}

export function prettyTime(milliseconds) {
	if(milliseconds > 999) {
		return(milliseconds / 1000).toFixed(2) + ' s'
	} else {
		return milliseconds + ' ms'
	}
}

export function logger(err, stats) {
	if(err) throw new gutil.PluginError('webpack', err)

	let statColor = stats.compilation.warnings.length < 1 ? 'green' : 'yellow'

	if(stats.compilation.errors.length > 0) {
		stats.compilation.errors.forEach(function (error) {
			handleErrors(error)
			statColor = 'red'
		})
	} else {
		const compileTime = prettyTime(stats.endTime - stats.startTime)
		gutil.log(gutil.colors[statColor](stats))
		gutil.log('Compiled with', gutil.colors.cyan('webpack'), 'in', gutil.colors.magenta(compileTime))
	}
}


export function getTasks() {
	return {
		assetTasks: Object.keys(TASK_CONFIG).filter((key) => TASK_CONFIG[key].task === 'asset'),
		codeTasks: Object.keys(TASK_CONFIG).filter((key) => TASK_CONFIG[key].task === 'code')
	}
}


export function getWatch() {
	return {
		watchList: Object.keys(TASK_CONFIG).filter((key) => TASK_CONFIG[key].watch),
	}
}