const path = require('path')

module.exports = {
	title: 'Mudstone',

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
			app: ['./app.js']
		},
		serviceWorker: {
			sw: ['./sw.js']
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

	serviceWorker: {
		watch: true,
		task: 'code',
		extensions: ['js']
	},

	json: {
		watch: true,
		task: 'asset',
		extensions: ['json']
	},

	twig: {
		watch: false,
		task: 'code',
		extensions: ['twig']
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

	// craftTemplates: {
	// 	task: 'asset',
	// 	watch: true,
	// 	extensions: ['twig', 'html']
	// },

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

	staticAssets: {
		task: null,
		watch: false,
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
						template: 'gulp/libs/sprites.tmp.scss'
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
		scssTemplate: '../gulp/libs/symbols.tmp.scss',
		scssOutputPath: 'scss/_system/gulp-output/',
		scssOutputFile: '_svg-symbols.scss',
		sourceFile: 'images/svg-symbols/source.html',
		fileName: 'symbols.twig',
		extensions: ['svg']
	},

	tokens: {
		task: 'asset',
		watch: true,
		prefix: '$tokens: ',
		extensions: ['json']
	},

	watch: {
		gulpWatch: {
			usePolling: false
		}
	},

	critical: {
		inline: false,
		width: 1300,
		minify: true,
		height: 900
	},

	fractal: {
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
			id: 'backstop_prod_test',
			viewports: [
				{
					name: 'phone',
					width: 320,
					height: 480
				},
				{
					name: 'tablet',
					width: 780,
					height: 1024
				},
				{
					name: 'desktop',
					width: 1120,
					height: 700
				}
			],
			paths: {
				bitmaps_reference: '__snapshots/bitmaps_reference',
				bitmaps_test: '__snapshots/bitmaps_test',
				casper_scripts: '__snapshots/casper_scripts',
				html_report: '__snapshots/html_report',
				ci_report: '__snapshots/ci_report'
			},
			casperFlags: [],
			engine: 'phantomjs',
			report: ['browser'],
			debug: false
		}
	}
}
