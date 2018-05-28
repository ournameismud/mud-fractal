const exampleTransition = {
	onExit: ({ next, ...rest }) => {
		log('onExit', rest)
		next()
	},

	onAfterExit: ({ ...rest }) => {
		log('onAfterExit', rest)
	},

	onEnter: ({ next, ...rest }) => {
		log('onEnter', rest)
		next()
	},

	onAfterEnter: ({ ...rest }) => {
		log('onAfterEnter', rest)
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
		view: {
			onExit: ({ next, ...rest }) => {
				log('onExit page-2', rest)
				next()
			},
			onEnter: ({ next, ...rest }) => {
				log('onEnter page-2', rest)
				next()
			}
		}
	},
	{
		path: '/page-3/',
		view: {
			onExit: ({ next, ...rest }) => {
				log('onExit page-3', rest)
				next()
			},
			onEnter: ({ next, ...rest }) => {
				log('onEnter page-3', rest)
				next()
			}
		}
	},
	{
		path: '/page-4/',
		view: exampleTransition
	}
]
