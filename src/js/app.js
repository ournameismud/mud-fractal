import '@/plugins/logger'
import App from '@/core/App'
import routes from '@/views'

if (module.hot) {
	module.hot.accept()
}

new App({
	/***
	 * router
	 *
	 * @property routes :array - routes object
	 * @property rootNode:HTMLElement - the root html node
	 * @property navLinks :array - an array of links that should update on navigation
	 * @property classes :object - clases applied to active links
	 * @property onExit :function - called before the dom is updated
	 * @property onEnter :function - called after the dom is updated
	 *
	 */
	router: {
		routes,
		rootNode: document.getElementById('page-wrapper'),
		navLinks: [
			...document.querySelectorAll('header a'),
			...document.querySelectorAll('footer a')
		],
		classes: {
			match: 'is-current',
			root: 'is-current-root',
			parent: 'is-current-parent'
		},
		onExit() {},
		onEnter() {}
	},

	/***
	 * chunks
	 *
	 * @property :chunks : dynamic import of modules - function used by the loader
	 *
	 */
	chunks: behaviour => import(`@/behaviours/${behaviour}`)
}).mount()
