import requireDir from 'require-dir'
import util from 'gulp-util'

import PATH_CONFIG from './gulp/path.config.dev.json'
import TASK_CONFIG from './gulp/task.config'

// Fallback for windows backs out of node_modules folder to root of project
process.env.PWD = process.env.PWD || __dirname

const { env } = util.env
let PATHS = PATH_CONFIG

if (util.env.config) {
	try {
		const PATH_OVERWRITES = require(`./gulp/path.config.${util.env
			.config}.json`)
		PATHS = { ...PATH_CONFIG, ...PATH_OVERWRITES }
	} catch (e) {
		throw new Error(e)
	}
}

global.env = env ? env : 'development'
global.PRODUCTION = global.env === 'production'
global.PATH_CONFIG = PATHS
global.SERVER = PATHS.browserSync
global.TASK_CONFIG = TASK_CONFIG
global.BUILD_TYPE = util.env.config
global.log = util.log

log(
	`                  _    ___             _       _ 
		 _____ _ _ _| |  |  _|___ ___ ___| |_ ___| |
		|     | | | . |  |  _|  _| .'|  _|  _| .'| |
		|_|_|_|___|___|  |_| |_| |__,|___|_| |__,|_|
																																	
		ENV: ${global.env}, 
		CONFIG: ${util.env.config ? util.env.config : 'Development'}
	`
)

requireDir('./gulp/tasks', {
	recurse: true
})
