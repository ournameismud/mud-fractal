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

new Router({
	routes: [
		{
			path: '/',
			view: 'home'
		},
		{
			path: '/page-1/',
			view: 'home',
			children: {
				path: ':id',
				view: 'terry'
			}
		},
		{
			path: '/page-2/',
			view: 'home'
		},
		{
			path: '/page-3/',
			view: 'home'
		},
		{
			path: '/page-4/',
			view: 'home'
		}
	]
}).mount()
