module.exports = {
	mode: 'fractal',

	craftTemplates: {
		watch: false,
		task: 'asset',
		extensions: ['twig']
	},

	fractal: {
		layout: 'wrapper/_layout.twig',
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
	}
}
