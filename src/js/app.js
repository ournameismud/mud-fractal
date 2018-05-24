import '@/plugins/logger'

// import eventBus from '@/core/eventBus'
// import Example from '@/behaviours/ExampleClass'

import loader from '@/core/loader'
import Router from '@/core/router'

const load = loader('@/behaviours/')

load.hydrate(document)

if (module.hot) {
	module.hot.accept()
}

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

new Router({
	routes: [
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
		}
	]
}).mount()
