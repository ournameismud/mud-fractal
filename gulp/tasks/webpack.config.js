const webpack = require('webpack')
const path = require('path')
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
		context,
		output: {
			path: path.normalize(dest),
			publicPath: '/dist/js/',
			pathinfo: env !== 'production' && true,
			globalObject: 'this', // https://github.com/webpack/webpack/issues/6642
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
				'~': path.resolve(process.env.PWD, PATH_CONFIG.src, 'templates/')
			}
		},

		devtool:
			env === 'production' ? 'source-map' : 'eval-cheap-module-source-map',

		module: {
			rules: [
				{
					test: /\.js?$/,
					loader: ['babel-loader', 'webpack-module-hot-accept'],
					exclude: /node_modules/
				},
				{
					test: /\.worker\.js$/,
					use: { loader: 'worker-loader' }
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
		config.plugins.push(new webpack.HotModuleReplacementPlugin())
	}

	if (env === 'production') {
		config.plugins.push(new webpack.NoEmitOnErrorsPlugin())

		config.plugins.push(
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
		)
	}

	return config
}
