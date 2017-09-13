/* global  */
import webpack from 'webpack'
import path from 'path'
import ProgressBarPlugin from 'progress-bar-webpack-plugin'
import querystring from 'querystring'
import { removeEmpty } from 'webpack-config-utils'
import { pathToUrl } from '../libs/utils'

export default env => {
	const context = path.resolve(
		process.env.PWD,
		PATH_CONFIG.src,
		PATH_CONFIG.js.src
	)
	const dest = path.resolve(
		process.env.PWD,
		PATH_CONFIG.public,
		PATH_CONFIG.js.dest
	)
	const { filename, entries, hot } = TASK_CONFIG.js

	const config = {
		name: 'bundle',
		entry: entries,
		cache: true,
		context: context,
		output: {
			path: path.normalize(dest),
			filename:
				env === 'production'
					? `${filename}.${TASK_CONFIG.stamp}.js`
					: `${filename}.js`,
			publicPath: pathToUrl(PATH_CONFIG.js.dest, '/'),
			pathinfo: env !== 'production' && true
		},
		resolve: {
			alias: {
				'@': context
			}
		},
		devtool:
			env === 'production' ? 'source-map' : 'eval-cheap-module-source-map',
		module: {
			loaders: [
				{
					test: /\.js?$/,
					loader: 'babel-loader',
					exclude: /node_modules/,
					query: {
						presets: [
							[
								'env',
								{
									targets: {
										browsers: ['last 2 versions', 'safari >= 7']
									}
								}
							]
						],
						plugins: [
							'transform-object-rest-spread',
							'transform-class-properties'
						],
						babelrc: false,
						cacheDirectory: false
					}
				},
				{
					test: /\.js$/,
					loader: 'eslint-loader',
					exclude: /node_modules/
				}
			]
		},
		plugins: removeEmpty([
			new ProgressBarPlugin(),
			new webpack.DefinePlugin({
				'process.env': {
					NODE_ENV: env === 'production' ? '"production"' : '"development"'
				}
			})
		])
	}

	if (env === 'development') {
		// Create new entry object with webpack-hot-middleware and react-hot-loader (if enabled)
		if (!hot || hot.enabled !== false) {
			for (let key in entries) {
				const entry = []
				const hotMiddleware = `webpack-hot-middleware/client?${querystring.stringify(
					hot
				)}`

				if (hot.react) {
					entry.push('react-hot-loader/patch')
				}

				entries[key] = entry.concat(hotMiddleware, entries[key])
			}
			config.plugins.push(new webpack.HotModuleReplacementPlugin())
		}
	}

	if (env === 'production') {
		config.plugins.push(
			new webpack.optimize.UglifyJsPlugin(),
			new webpack.NoEmitOnErrorsPlugin()
		)
	}

	return config
}
