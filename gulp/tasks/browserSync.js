import fractal from './fractal'
import gulp from 'gulp'
import webpack from 'webpack'
import webpackConfig from './webpack.config.babel'
import { pathToUrl } from '../libs/utils'
import path from 'path'
import browserSync from 'browser-sync'

function fractalServer() {
	const config = webpackConfig(global.env)
	const compiler = webpack(config)
	const logger = fractal.cli.console

	fractal.web.set('server.syncOptions', {
		baseDir: path.resolve(process.env.PWD, SERVER.server.baseDir),
		middleware: [
			require('webpack-dev-middleware')(compiler, {
				stats: 'errors-only',
				publicPath: pathToUrl('/', config.output.publicPath)
			}),
			require('webpack-hot-middleware')(compiler)
		],
		watch: true,
		logFileChanges: true,
		watchOptions: {
			ignoreInitial: true,
			ignored: ['**/*.js', '**/*.scss', '!**/*.config.js', '**/*.json']
		},
		files: [
			{
				options: {
					ignored: '**/*.hot-update.json'
				}
			}
		],
		...TASK_CONFIG.server
	})

	fractal.web.set('server.sync', true)

	const server = fractal.web.server()

	server.on('error', err => logger.error(err.message))

	return server.start().then(() => {
		logger.success(`Fractal server is now running at ${server.url}`)
	})
}

function devServer() {
	const config = webpackConfig(global.env)
	const compiler = webpack(config)
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
			publicPath: pathToUrl('/', config.output.publicPath)
		}),
		require('webpack-hot-middleware')(compiler)
	]

	SERVER.open = false

	browserSync.init(SERVER)
}

gulp.task('server:fractal', fractalServer)
gulp.task('server:cms', devServer)
