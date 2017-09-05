import path from 'path'
import requireDir from 'require-dir'
import util from 'gulp-util'

import PATH_CONFIG from './gulp/path.config.dev.json'
import PATH_CONFIG_CMS from './gulp/path.config.cms.json'
import PATH_CONFIG_PRODUCTION from './gulp/path.config.production.json'
import PATH_CONFIG_TEST from './gulp/path.config.test.json'
import TASK_CONFIG from './gulp/task.config'

// Fallback for windows backs out of node_modules folder to root of project
process.env.PWD = process.env.PWD || path.resolve(process.cwd(), '../../')

let CONFIG = PATH_CONFIG

if(util.env.test) {
	CONFIG = {...PATH_CONFIG, ...PATH_CONFIG_TEST}
} 

if(util.env.production) {
	CONFIG = {...PATH_CONFIG, ...PATH_CONFIG_PRODUCTION}
} 

if(util.env.cms) {
	CONFIG = {...PATH_CONFIG, ...PATH_CONFIG_CMS}
}

if(util.env.cms && util.env.production) {
	CONFIG = {...PATH_CONFIG,  ...PATH_CONFIG_PRODUCTION, ...PATH_CONFIG_CMS}
}

global.production = util.env.production

global.PATH_CONFIG = CONFIG
global.SERVER = CONFIG.browserSync

global.TASK_CONFIG = TASK_CONFIG


requireDir('./gulp/tasks', {
	recurse: true
})