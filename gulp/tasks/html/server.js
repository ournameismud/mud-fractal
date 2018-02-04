const webpack = require('webpack')
const { pathToUrl } = require('../../utils/paths')
const path = require('path')
const browserSync = require('browser-sync')

module.exports = {
	devServer
}

function devServer() {
	const compiler = webpack(global.WEBPACK_CONFIG)
	const proxyConfig = SERVER.proxy || null

	if (typeof proxyConfig === 'string') {
		SERVER.proxy = {
			target: proxyConfig
		}
	}
	// Resolve path from PWD
	if (SERVER.server && SERVER.server.baseDir) {
		SERVER.server.baseDir = path.resolve(process.env.PWD, SERVER.server.baseDir)
	}

	// Resolve files from PWD
	if (SERVER.files) {
		SERVER.files = SERVER.files.map(function(glob) {
			return path.resolve(process.env.PWD, glob)
		})
	}

	const server = SERVER.proxy || SERVER.server

	server.middleware = [
		require('webpack-dev-middleware')(compiler, {
			stats: 'errors-only',
			publicPath: pathToUrl('/', global.WEBPACK_CONFIG.output.publicPath)
		}),
		require('webpack-hot-middleware')(compiler)
	]

	browserSync.init({
		...SERVER,
		logFileChanges: true,
		watchOptions: {
			ignoreInitial: true,
			ignored: ['**/*.js', '**/*.scss', '!**/*.config.js', '**/*.json']
		},
		files: [
			{
				match: [
					path.resolve(process.env.PWD, 'deploy/craft/templates/**/*.twig')
				]
			}
		],
		...TASK_CONFIG.server
	})
}
