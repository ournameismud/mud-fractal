const path = require('path')

module.exports = {
	title: 'Mud-Fractal',
	mode: 'html',

	cms: {
		watch: false,
		task: 'asset',
		extensions: ['twig']
	},

	critical: {
		minify: true,
		width: 1024,
		height: 768
	},

	html: {
		task: 'code',
		watch: true,
		extensions: ['twig', 'html', 'json'],
		excludeFolders: ['__data', 'wrapper', 'macros']
	},

	fractal: {
		layout: 'wrapper/_base.twig',
		context: {
			siteTitle: 'Mudstone Component Library'
		},
		statuses: {
			tool: {
				label: 'Prototype',
				description: 'Do not implement.',
				color: '#FF3333'
			},
			wip: {
				label: 'WIP',
				description: 'Work in progress. Implement with caution.',
				color: '#FF9233'
			},
			ready: {
				label: 'Ready',
				description: 'Ready to implement. Snapshot saved',
				color: '#4ae4ae'
			},
			test: {
				label: 'Test',
				description: 'Regression test',
				color: '#44aaee'
			},
			production: {
				label: 'Production',
				description: 'Component in production, regression tests approved',
				color: '#29CC29'
			}
		}
	},

	stamp: Date.now(),

	server: {
		open: false,
		browser: ['google chrome'],
		port: 3000,
		logLevel: 'info'
		// https: {
		// 	key: path.resolve(process.env.PWD, 'private', 'key.pem'),
		// 	cert: path.resolve(process.env.PWD, 'private', 'cert.pem')
		// }
	},

	js: {
		entries: {
			preview: ['./app.js'], // for craftcms, babel-polyfill has a hissy fit
			app: ['./app.js']
		},
		hot: {
			enabled: true,
			reload: true,
			quiet: true,
			react: false
		},
		extensions: ['js', 'json'],
		extractSharedJs: false,
		filename: 'bundle' // no extension
	},

	json: {
		watch: true,
		task: 'asset',
		extensions: ['json']
	},

	scss: {
		task: 'code',
		watch: true,
		autoprefixer: {
			browsers: ['last 3 version']
		},
		options: {
			indentedSyntax: false,
			outputStyle: 'expanded'
		},
		cssnanoOptions: {
			autoprefixer: false
		},
		extensions: ['scss'],
		lintIgnorePaths: ['_system/**/*.scss', '_config/*.scss'],
		filename: 'style' // no extension
	},

	purge: {
		whitelistPatterns: [/plyr/, /is-/, /has-/, /no-/, /icon--/]
	},

	images: {
		task: 'asset',
		watch: true,
		extensions: ['jpg', 'png', 'svg', 'gif']
	},

	svgs: {
		task: 'asset',
		watch: true,
		extensions: ['svg']
	},

	inlineSvgs: {
		task: 'asset',
		watch: true,
		extensions: ['svg']
	},

	staticAssets: {
		task: 'asset',
		watch: true,
		extensions: ['*']
	},

	sprites: {
		task: false,
		watch: false,
		mode: {
			css: {
				spacing: {
					padding: 0
				},
				dest: './',
				layout: 'diagonal',
				sprite: 'svg-sprite.svg',
				bust: false,
				render: {
					scss: {
						dest: '_system/gulp-output/_svg-sprites.scss',
						template: 'gulp/utils/sprites.tmp.scss'
					}
				}
			}
		},

		extensions: ['svg']
	},

	cssFonts: {
		task: 'asset',
		watch: true,
		extensions: ['css']
	},

	fonts: {
		task: 'asset',
		watch: true,
		extensions: ['woff2', 'woff', 'eot', 'ttf', 'svg']
	},

	favicons: {
		task: 'asset',
		extensions: ['xml', 'ico', 'json', 'png', 'svg']
	},

	symbols: {
		task: 'asset',
		watch: true,
		scssTemplate: '../gulp/utils/symbols.tmp.scss',
		scssOutputPath: 'scss/_system/gulp-output/',
		scssOutputFile: '_svg-symbols.scss',
		sourceFile: 'images/svg-symbols/source.html',
		fileName: 'symbols.twig',
		extensions: ['svg']
	},

	watch: {
		gulpWatch: {
			usePolling: false
		}
	},

	backstop: {
		url: 'http://localhost:3000/components/preview/',
		defaults: {
			selectorExpansion: true,
			hideSelectors: [],
			removeSelectors: [],
			readyEvent: null,
			delay: 500,
			misMatchThreshold: 0.2,
			requireSameDimensions: true,
			selector: ['body']
		},
		config: {
			id: 'backstop_default',
			viewports: [
				{
					label: 'phone',
					width: 320,
					height: 480
				},
				{
					label: 'tablet',
					width: 1024,
					height: 768
				}
			],
			onBeforeScript: 'chromy/onBefore.js',
			onReadyScript: 'chromy/onReady.js',
			scenarios: [],
			paths: {
				bitmaps_reference: '__snapshots/bitmaps_reference',
				bitmaps_test: '__snapshots/bitmaps_test',
				engine_scripts: '__snapshots/engine_scripts',
				html_report: '__snapshots/html_report',
				ci_report: '__snapshots/ci_report'
			},
			report: ['browser'],
			engine: 'chrome',
			engineFlags: [],
			asyncCaptureLimit: 5,
			asyncCompareLimit: 50,
			debug: false,
			debugWindow: false
		}
	}
}
