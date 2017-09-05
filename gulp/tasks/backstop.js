import browserSync from 'browser-sync'
import gulp from 'gulp'
import path from 'path'
import config from '../backstop.config'
import backstopjs from 'backstopjs'
import util from 'gulp-util'
import requireGlob from 'require-glob'


export default function test() {

	const proxyConfig = SERVER.proxy || null
	const task = util.env.reference ? 'reference' : 'test'
	
	requireGlob('../../src/templates/**/**/*.test.config.js')
		.then(function (modules) {
			const scenarios = []

			for(let key in modules) {
				for(let row in modules[key]) {
					const config = `${row}TestConfig`
					scenarios.push(...modules[key][row][config].default)
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