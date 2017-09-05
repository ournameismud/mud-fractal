/* global  */
import webpack from 'webpack'
import path from 'path'
import ProgressBarPlugin from 'progress-bar-webpack-plugin'
import {
	getIfUtils,
	removeEmpty
} from 'webpack-config-utils'
import {
	pathToUrl
} from '../libs/utils'


const webpackConfig = env => {

	const context = path.resolve(process.env.PWD, PATH_CONFIG.src, PATH_CONFIG.js.src)
	const dest = path.resolve(process.env.PWD, PATH_CONFIG.dest, PATH_CONFIG.js.dest)
	const publicPath = pathToUrl(PATH_CONFIG.js.dest, '/')
	const filename = TASK_CONFIG.js.filename
	const {
		ifProd
	} = getIfUtils(env)

	const config = {
		entry: TASK_CONFIG.js.entries,
		cache: true,
		context: context,
		output: {
			path: path.normalize(dest),
			filename: `${filename}.js`,
			publicPath: publicPath
		},
		devtool: ifProd('eval', 'source-map'),
		resolve: {
			alias: {
				'vue$': 'vue/dist/vue.common.js',
				'@': path.resolve(process.env.PWD, PATH_CONFIG.src, PATH_CONFIG.js.src)
			}
		},
		module: {
			loaders: [
				{
					test: /\.js?$/,
					loader: 'babel-loader',
					exclude: /node_modules/,
					query: {
						'presets': [
							['env', {
								'targets': {
									'browsers': ['last 2 versions', 'safari >= 7']
								}
							}]
						],
						'plugins': [
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
			new ProgressBarPlugin()
		])
	}


	if(env === 'development') {
		config.devtool = 'eval-cheap-module-source-map'
		config.output.pathinfo = true

		// Create new entries object with webpack-hot-middleware and react-hot-loader (if enabled)
		if(TASK_CONFIG.js.hot) {
			for(let key in TASK_CONFIG.js.entries) {
				const entry = TASK_CONFIG.js.entries[key]
				// TODO: To work in < node 6, prepend process.env.PWD + node_modules/
				const entries = []
				let middleware = 'webpack-hot-middleware/client?'

				if(!TASK_CONFIG.js.hot || TASK_CONFIG.js.hot.reload !== false) {
					middleware += '&reload=true'
				}

				if(TASK_CONFIG.js.hot && TASK_CONFIG.js.hot.noInfo) {
					middleware += '&noInfo=true'
				}

				if(TASK_CONFIG.js.hot && TASK_CONFIG.js.hot.quiet) {
					middleware += '&quiet=true'
				}

				TASK_CONFIG.js.entries[key] = entries.concat(middleware).concat(entry)
			}


			config.plugins.push(
				new webpack.DefinePlugin({
					'process.env': {
						NODE_ENV: '"development"'
					}
				}),
				new webpack.HotModuleReplacementPlugin()	
			)
		}
		// Addtional loaders for dev
		config.module.loaders = config.module.loaders.concat(TASK_CONFIG.js.developmentLoaders || [])
	}


	if(env === 'production') {
		config.plugins.push(
			new webpack.DefinePlugin({
				'process.env': {
					NODE_ENV: '"production"'
				}
			}),
			new webpack.optimize.UglifyJsPlugin(),
			new webpack.NoEmitOnErrorsPlugin()
		)

		config.output.filename = `${filename}.${TASK_CONFIG.stamp}.js`
	}

	return config
}


export default webpackConfig