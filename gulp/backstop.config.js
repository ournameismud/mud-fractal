import path from 'path'

export default {
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
		bitmaps_reference: path.resolve(process.env.PWD, '__snapshots/bitmaps_reference'),
		bitmaps_test: path.resolve(process.env.PWD, '__snapshots/bitmaps_test'),
		casper_scripts: path.resolve(process.env.PWD, '__snapshots/casper_scripts'),
		html_report: path.resolve(process.env.PWD, '__snapshots/html_report'),
		ci_report: path.resolve(process.env.PWD, '__snapshots/ci_report')
	},
	casperFlags: [],
	engine: 'phantomjs',
	report: ['browser'],
	debug: false
}
