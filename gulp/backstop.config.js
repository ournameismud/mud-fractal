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
