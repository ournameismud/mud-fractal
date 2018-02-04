const path = require('path')
const fs = require('fs')
const deepmerge = require('deepmerge')

module.exports = {
	resolvePath,
	getPathConfig,
	getTaskConfig,
	getPaths,
	pathToUrl,
	getWebpackConfig
}

function pathToUrl() {
	// Normalizes Windows file paths to valid url paths
	return path.join.apply(this, arguments).replace(/\\/g, '/')
}

function getPaths(type) {
	return {
		src: [
			path.resolve(
				process.env.PWD,
				PATH_CONFIG.src,
				PATH_CONFIG[type].src,
				'**/*.{' + TASK_CONFIG[type].extensions + '}'
			)
		],
		entry: [
			path.resolve(
				process.env.PWD,
				PATH_CONFIG.src,
				PATH_CONFIG[type].src,
				`*.${type}`
			)
		],
		dest: path.resolve(
			process.env.PWD,
			PATH_CONFIG.public,
			PATH_CONFIG[type].dest
		)
	}
}

function resolvePath() {
	return path.resolve(process.env.PWD, [...arguments].join(','))
}

function getPathConfig() {
	const customTaskConfig = path.resolve(
		process.env.PWD,
		'config/path.config.json'
	)
	const defaultTaskConfig = require('../path.config.json')
	if (fs.existsSync(customTaskConfig)) {
		return deepmerge(defaultTaskConfig, require(customTaskConfig))
	}

	return require('../path.config.json')
}

function getTaskConfig() {
	const customPathConfig = path.resolve(
		process.env.PWD,
		'config/task.config.js'
	)
	const defaultPathConfig = require('../task.config')
	if (fs.existsSync(customPathConfig)) {
		return { ...defaultPathConfig, ...require(customPathConfig) }
	}

	return require('../task.config')
}

function getWebpackConfig(env) {
	const customWebpack = path.resolve(
		process.env.PWD,
		'config/webpack.config.js'
	)

	if (fs.existsSync(customWebpack)) {
		return require(customWebpack)(env)
	}

	return require('../tasks/webpack.config.js')(env)
}
