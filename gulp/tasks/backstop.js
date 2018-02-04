const browserSync = require('browser-sync')
const gulp = require('gulp')
const path = require('path')
const backstopjs = require('backstopjs')
const util = require('gulp-util')
const requireGlob = require('require-glob')
// const { resolvePath } = require('../utils/paths')
module.exports = {
	test
}

gulp.task('backstop_reference', test)

function test() {
	const { url, defaults } = TASK_CONFIG.backstop
	const proxyConfig = SERVER.proxy || null
	const task = util.env.reference ? 'reference' : 'test'

	requireGlob(
		path.resolve(
			process.env.PWD,
			PATH_CONFIG.src,
			PATH_CONFIG.fractal.src,
			'**/**/*.config.js'
		)
	).then(function (modules) {
		const scenarios = []

		for (let key in modules) {
			for (let row in modules[key]) {
				let config = modules[key][row][`${row}Config`]

				const title = row
				if (title !== 'context') {
					const { selector = 'body', variants = [], status } = config

					if (status === 'test') {
						if (variants.length > 0) {
							config = variants.map(({ name }) => {
								return {
									...defaults,
									selectors: [`${selector}`],
									label: name,
									url: `${url}${title}--${name}.html`
								}
							})
							scenarios.push(...config)
						} else {
							scenarios.push({
								...defaults,
								selectors: [`${selector}`],
								label: title,
								url: `${url}${title}.html`
							})
						}
					}
				}
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
			SERVER.files = SERVER.files.map(function (glob) {
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
				.catch(e => {
					console.error(e)
					browserSync.exit()
				})
		})
	})
}
