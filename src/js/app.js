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
	 * @prop routes :array - routes object
	 * @prop rootNode:HTMLElement - the root html node
	 * @prop navLinks :array - an array of links that should update on navigation
	 * @prop classes :object - clases applied to active links
	 * @prop onExit :function - called before the dom is updated
	 * @prop onEnter :function - called after the dom is updated
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
	 * @prop :chunks : dynamic import of modules - function used by the loader
	 *
	 */
	chunks: behaviour => import(`@/behaviours/${behaviour}`)
}).mount()
