const path = require('path')
const fractal = require('@frctl/fractal').create()
const { templateEngine, docsEngine } = require('./engine')
const { exportPaths } = require('./utils')
;(function() {
	if (TASK_CONFIG.mode !== 'fractal') return

	const paths = {
		src: PATH_CONFIG.src,
		build: PATH_CONFIG.fractal.build,
		tmp: PATH_CONFIG.fractal.tmp
	}

	const stamp = PRODUCTION ? `.${TASK_CONFIG.stamp}` : ''
	// Project config
	fractal.set('project.title', TASK_CONFIG.title)
	// Components config
	fractal.components.engine(require('@frctl/twig')(templateEngine(stamp)))
	fractal.components.set('default.preview', '@base')
	fractal.components.set('default.status', 'wip')
	fractal.components.set('default.collated', false)
	fractal.components.set('ext', '.twig')
	fractal.components.set(
		'path',
		path.resolve(process.env.PWD, paths.src, 'templates')
	)
	fractal.components.set(
		'layout',
		path.resolve(process.env.PWD, paths.src, TASK_CONFIG.fractal.layout)
	)
	fractal.components.set('default.context', TASK_CONFIG.fractal.context)
	fractal.components.set('statuses', TASK_CONFIG.fractal.statuses)

	// Docs config
	fractal.docs.engine(require('@frctl/nunjucks')(docsEngine()))
	fractal.docs.set('ext', '.md')
	fractal.docs.set('path', path.resolve(process.env.PWD, paths.src, 'docs'))

	// Web UI config
	fractal.web.theme(
		require('@frctl/mandelbrot')({
			favicon: '/favicon.ico',
			lang: 'en-gb',
			styles: ['default', `/dist/css/theme${stamp}.css`],
			static: {
				mount: 'fractal'
			}
		})
	)
	fractal.web.set('static.path', path.resolve(process.env.PWD, paths.tmp))
	fractal.web.set('builder.dest', path.resolve(process.env.PWD, paths.build))
	fractal.web.set('builder.urls.ext', '.html')

	// https://clearleft.com/posts/443
	fractal.components.on('updated', exportPaths.bind(null, fractal))
})()

module.exports = {
	fractal
}
