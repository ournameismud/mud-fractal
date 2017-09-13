import fractal from './fractal'
import gulp from 'gulp'
import webpack from 'webpack'
import webpackConfig from './webpack.config.babel'
import { pathToUrl } from '../libs/utils'
import path from 'path'

export default function fractalServer() {
	const env = global.production ? 'production' : 'development'
	const config = webpackConfig(env)
	const compiler = webpack(config)
	const logger = fractal.cli.console

	fractal.web.set('server.syncOptions', {
		open: false,
		browser: ['google chrome'],
		baseDir: path.resolve(process.env.PWD, SERVER.server.baseDir),
		middleware: [
			require('webpack-dev-middleware')(compiler, {
				stats: 'errors-only',
				publicPath: pathToUrl('/', config.output.publicPath)
			}),
			require('webpack-hot-middleware')(compiler)
		],
		port: 3000,
		logLevel: 'info',
		https: {
			key: path.resolve(process.env.PWD, 'private', 'key.pem'),
			cert: path.resolve(process.env.PWD, 'private', 'cert.pem')
		},
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
		]
	})

	fractal.web.set('server.sync', true)

	const server = fractal.web.server()

	server.on('error', err => logger.error(err.message))

	return server.start().then(() => {
		logger.success(`Fractal server is now running at ${server.url}`)
	})
}

gulp.task('browserSync', fractalServer)
