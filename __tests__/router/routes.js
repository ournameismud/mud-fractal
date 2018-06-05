const transitions = {
	onLoad() {
		document.querySelector(this.el).classList.add('onLoad')
	},

	onError() {
		log('on error')
		//	document.body.classList.add('onError')
	},

	onExit({ next }) {
		next()
	}
}

export default [
	{
		path: '/',
		name: 'root',
		view: transitions,
		options: {}
	},
	{
		path: '/a/',
		name: 'a',
		view: transitions,
		options: {},
		children: [
			{
				path: /(p)+(\d+)/,
				view: {},
				options: {},
				name: 'pagination'
			},
			{
				path: ':id',
				name: 'dynamic',
				view: {},
				options: {}
			},
			{
				path: '/terry/',
				name: 'terry',
				view: {},
				options: {},
				children: {
					path: ':id',
					name: 'terry:id',
					view: {},
					options: {}
				}
			}
		]
	},
	{
		path: '*',
		name: 'default',
		view: transitions,
		options: {}
	}
]
