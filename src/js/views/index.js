const exampleTransition = {
	onExit: ({ next, from: { route: { path } } }) => {
		log('onExit', path)
		next()
	},

	onAfterExit: ({ from: { route: { path } } }) => {
		log('onAfterExit', path)
	},

	onEnter: ({ next, to: { route: { path } } }) => {
		log('onEnter', path)
		next()
	},

	onAfterEnter: ({ to: { route: { path } } }) => {
		log('onAfterEnter', path)
	}
}

export default [
	{
		path: '/',
		view: exampleTransition
	},
	{
		path: '/page-1/',
		view: exampleTransition,
		children: {
			path: ':id',
			view: exampleTransition
		}
	},
	{
		path: '/page-2/',
		view: exampleTransition
	},
	{
		path: '/page-3/',
		view: exampleTransition
	},
	{
		path: '/page-4/',
		view: exampleTransition
	},
	{
		path: '*',
		view: exampleTransition
	}
]
