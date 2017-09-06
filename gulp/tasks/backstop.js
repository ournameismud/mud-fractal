import browserSync from 'browser-sync'
import gulp from 'gulp'
import path from 'path'
import config from '../backstop.config'
import backstopjs from 'backstopjs'
import util from 'gulp-util'
import requireGlob from 'require-glob'

export default function test() {

	const { url, defaults } = TASK_CONFIG.backstop
	const proxyConfig = SERVER.proxy || null
	const task = util.env.reference ? 'reference' : 'test'
	requireGlob(path.resolve(process.env.PWD, PATH_CONFIG.src, PATH_CONFIG.fractal.src, '**/**/*.test.config.js'))
		.then(function (modules) {
			const scenarios = []

			for(let key in modules) {
				for(let row in modules[key]) {
					const config = modules[key][row][`${row}TestConfig`].default.map((conf) => {
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
			
			if(typeof proxyConfig === 'string') {
				SERVER.proxy = {
					target: proxyConfig
				}
			}
		
			// Resolve path from PWD
			if(SERVER.server && SERVER.server.baseDir) {
				SERVER.server.baseDir = path.resolve(process.env.PWD, SERVER.server.baseDir)
			}
		
			// Resolve files from PWD
			if(SERVER.files) {
				SERVER.files = SERVER.files.map(function (glob) {
					return path.resolve(process.env.PWD, glob)
				})
			}

			const conf = {
				...config,
				scenarios
			}


			SERVER.notify = false
			SERVER.open = false
			browserSync.init(SERVER, () => {
				backstopjs(task, {
					config: conf
				}).then(() => {
					browserSync.exit()
				}).catch(() => {
					browserSync.exit()
				})
			})
		})

}

gulp.task('backstop_reference', test)
