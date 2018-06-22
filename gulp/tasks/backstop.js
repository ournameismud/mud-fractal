const browserSync = require('browser-sync')
const gulp = require('gulp')
const path = require('path')
const backstopjs = require('backstopjs')
const util = require('gulp-util')
const requireGlob = require('require-glob')

/* eslint-disable no-restricted-syntax */

const camelCaseToDash = myStr =>
	myStr.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()

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
	).then(modules => {
		const scenarios = []

		for (const key in modules) {
			for (const row in modules[key]) {
				let config = modules[key][row][`${row}Config`]

				const title = camelCaseToDash(row)
				if (title !== 'context') {
					const { selector = 'body', variants = [], status } = config

					if (status === 'test') {
						if (variants.length > 0) {
							config = variants.map(({ name }) => ({
								...defaults,
								selectors: [`${selector}`],
								label: name,
								url: `${url}${title}--${name}.html`
							}))
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
			SERVER.files = SERVER.files.map(glob =>
				path.resolve(process.env.PWD, glob)
			)
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
					console.error(e) // eslint-disable-line no-console
					browserSync.exit()
				})
		})
	})
}

module.exports = {
	test
}

gulp.task('backstop_reference', test)
