import fs from 'fs'
import path from 'path'
const fractal = require('@frctl/fractal').create()

const paths = {
	src: PATH_CONFIG.src,
	build: PATH_CONFIG.fractal.build,
	static: PATH_CONFIG.fractal.static
}

const stamp = global.production ? `.${TASK_CONFIG.stamp}` : ''

const mandelbrot = require('@frctl/mandelbrot')({
	favicon: '/favicon.ico',
	lang: 'en-gb',
	styles: ['default', `/dist/css/theme${stamp}.css`],
	static: {
		mount: 'fractal'
	}
})

const mdAbbr = require('markdown-it-abbr')
const mdFootnote = require('markdown-it-footnote')
const md = require('markdown-it')({
	html: true,
	xhtmlOut: true,
	typographer: true
})
	.use(mdAbbr)
	.use(mdFootnote)

const twigConf = {
	filters: {
		markdown(str) {
			return md.render(str)
		},
		markdownInline(str) {
			return md.renderInline(str)
		},
		slugify(str) {
			return str.toLowerCase().replace(/[^\w]+/g, '')
		},
		stringify() {
			return JSON.stringify(this, null, '\t')
		}
	},
	functions: {
		getStamp() {
			return {
				stamp: stamp
			}
		}
	}
}

const twigAdapter = require('@frctl/twig')(twigConf)
// const twigAdapterDocs = require('@frctl/twig')(twigConf)
// Project config
fractal.set('project.title', TASK_CONFIG.title)

// Components config
fractal.components.engine(twigAdapter)
fractal.components.set('default.preview', '@layout')
fractal.components.set('default.status', 'wip')
fractal.components.set('default.collated', false)
fractal.components.set('ext', '.twig')
fractal.components.set('path', `${paths.src}/templates`)
fractal.components.set('layout', `${paths.src}/templates/wrapper/_layout.twig`)
fractal.components.set('default.context', TASK_CONFIG.fractal.context)
fractal.components.set('statuses', TASK_CONFIG.fractal.statuses)

// Docs config
// fractal.docs.engine(twigAdapterDocs)
fractal.docs.set('ext', '.md')
fractal.docs.set('path', `${paths.src}/docs`)

// Web UI config
fractal.web.theme(mandelbrot)
fractal.web.set('static.path', paths.static)
fractal.web.set('builder.dest', paths.build)
fractal.web.set('builder.urls.ext', '.html')

// https://clearleft.com/posts/443
export function exportPaths() {
	if (!global.production) return

	return new Promise((resolve, reject) => {
		const map = {}
		for (let item of fractal.components.flatten()) {
			map[`@${item.handle}`] = {
				src: path.relative(process.cwd(), item.viewPath),
				dest: path.relative(process.cwd(), item.viewDir).split('templates/')[1]
			}
		}

		fs.writeFile(
			path.resolve(
				process.env.PWD,
				PATH_CONFIG.craftTemplates.config,
				'components-map.json'
			),
			JSON.stringify(map, null, 2),
			'utf8',
			err => {
				if (err) {
					reject(err)
					return
				}
				resolve(map)
			}
		)
	})
}

fractal.components.on('updated', exportPaths)

export default fractal
