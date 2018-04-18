const webpack = require('webpack')
const path = require('path')
const querystring = require('querystring')
const { removeEmpty } = require('webpack-config-utils')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const { InjectManifest } = require('workbox-webpack-plugin')

module.exports = env => {
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
		mode: env,
		entry: entries,
		cache: true,
		context: context,
		output: {
			path: path.normalize(dest),
			publicPath: '/dist/js/',
			pathinfo: env !== 'production' && true,
			filename:
				env === 'production'
					? `[name].${filename}.${TASK_CONFIG.stamp}.js`
					: `[name].${filename}.js`
		},

		optimization: {
			splitChunks: {
				cacheGroups: {
					commons: {
						test: /[\\/]node_modules[\\/]/,
						name: 'vendor',
						chunks: 'all'
					}
				}
			}
		},

		resolve: {
			alias: {
				'@': context,
				'~': path.resolve(
					process.env.PWD,
					PATH_CONFIG.src,
					'templates/04-components/'
				)
			}
		},

		devtool:
			env === 'production' ? 'source-map' : 'eval-cheap-module-source-map',

		module: {
			rules: [
				{
					test: /\.js?$/,
					loader: 'babel-loader',
					exclude: /node_modules/
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
			}),

			new InjectManifest({
				globDirectory: path.resolve(
					process.env.PWD,
					PATH_CONFIG.public,
					'dist'
				),
				globPatterns: ['**/*.{html,js,css,svg,png}'],
				globIgnores: ['theme.*.css'],
				swDest: path.resolve(process.env.PWD, PATH_CONFIG.public, 'sw.js'),
				swSrc: path.resolve(
					process.env.PWD,
					PATH_CONFIG.src,
					PATH_CONFIG.js.src,
					'service-worker.js'
				),
				modifyUrlPrefix: {
					// Remove a '/dist' prefix from the URLs:
					'css/': '/dist/css/',
					'js/': '/dist/js/',
					'images/': '/dist/images/'
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
		config.plugins.push(new webpack.NoEmitOnErrorsPlugin())
	}

	return config
}
