const exampleTransition = {
	onExit: ({ next, from: { route: { path } }, ...rest }) => {
		console.info('onExit', path, rest)
		next()
	},

	onAfterExit: ({ from: { route: { path } }, ...rest }) => {
		console.info('onAfterExit', path, rest)
	},

	onEnter: ({ next, to: { route: { path } }, ...rest }) => {
		console.info('onEnter', path, rest)
		next()
	},

	onAfterEnter: ({ to: { route: { path } }, ...rest }) => {
		console.info('onAfterEnter', path, rest)
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
