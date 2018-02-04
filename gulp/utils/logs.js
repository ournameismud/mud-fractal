/* eslint-disable no-unused-vars */
const path = require('path')
const notify = require('gulp-notify')
const gutil = require('gulp-util')
const fs = require('fs')

module.exports = {
	handleErrors,
	prettyTime,
	logger
}

function handleErrors(errorObject, callback) {
	notify
		.onError(
			errorObject
				.toString()
				.split(': ')
				.join(':\n')
		)
		.apply(this, arguments)
	// Keep gulp from hanging on this task
	if (typeof this.emit === 'function') this.emit('end')
}

function prettyTime(milliseconds) {
	if (milliseconds > 999) {
		return (milliseconds / 1000).toFixed(2) + ' s'
	} else {
		return milliseconds + ' ms'
	}
}

function logger(err, stats) {
	if (err) throw new gutil.PluginError('webpack', err)

	let statColor = stats.compilation.warnings.length < 1 ? 'green' : 'yellow'

	if (stats.compilation.errors.length > 0) {
		stats.compilation.errors.forEach(function(error) {
			handleErrors(error)
			statColor = 'red'
		})
	} else {
		const compileTime = prettyTime(stats.endTime - stats.startTime)
		gutil.log(gutil.colors[statColor](stats))
		gutil.log(
			'Compiled with',
			gutil.colors.cyan('webpack'),
			'in',
			gutil.colors.magenta(compileTime)
		)
	}
}

/*
	thanks https://github.com/vigetlabs/blendid/blob/master/gulpfile.js/lib/get-path-config.js
*/
