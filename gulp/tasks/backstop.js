const browserSync = require('browser-sync')
const gulp = require('gulp')
const path = require('path')
const backstopjs = require('backstopjs')
const util = require('gulp-util')
const requireGlob = require('require-glob')
const { resolvePath } = require('../utils/paths')
module.exports = {
	test
}

gulp.task('backstop_reference', test)

function test() {
	const { url, defaults } = TASK_CONFIG.backstop
	const proxyConfig = SERVER.proxy || null
	const task = util.env.reference ? 'reference' : 'test'
	const test = task === 'reference' ? 'ready' : 'test'

	requireGlob(
		resolvePath(
			PATH_CONFIG.src,
			PATH_CONFIG.fractal.src,
			'**/**/*.test.config.js'
		)
	).then(function(modules) {
		const scenarios = []

		for (let key in modules) {
			for (let row in modules[key]) {
				const config = modules[key][row][`${row}TestConfig`].default
					.filter(({ status }) => status === test)
					.map(conf => {
						return {
							...defaults,
							...conf.options,
							label: conf.label,
							url: `${url}${conf.label}.html`
						}
					})
				scenarios.push(...config)
			}
		}

		if (typeof proxyConfig === 'string') {
			SERVER.proxy = {
				target: proxyConfig
			}
		}

		// Resolve path from PWD
		if (SERVER.server && SERVER.server.baseDir) {
			SERVER.server.baseDir = path.resolve(
				process.env.PWD,
				SERVER.server.baseDir
			)
		}

		// Resolve files from PWD
		if (SERVER.files) {
			SERVER.files = SERVER.files.map(function(glob) {
				return path.resolve(process.env.PWD, glob)
			})
		}

		const conf = {
			...TASK_CONFIG.backstop.config,
			scenarios
		}

		SERVER.notify = false
		SERVER.open = false
		browserSync.init(SERVER, () => {
			backstopjs(task, {
				config: conf
			})
				.then(() => {
					browserSync.exit()
				})
				.catch(() => {
					browserSync.exit()
				})
		})
	})
}
