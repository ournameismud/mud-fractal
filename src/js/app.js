import '@/plugins/logger'
import App from '@/core/App'
import routes from '@/views'
import Ui from '@/core/UiLoader'

if (module.hot) {
	module.hot.accept()
}

Ui.mount().then(() => {
	new App({
		// @property {Array} routes - routes object
		// @property {HTMLElement} rootNode - the root html node
		// @property {Array} navLinks - an array of links that should update on navigation
		// @property {Object} classes - clases applied to active links
		// @property {Function} onExit - called before the dom is updated
		// @property {Function} function - called after the dom is updated

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
			prefetchTargets: '[data-prefetch]',
			onExit() {},
			onEnter() {}
		},

		// @property {Function} routes - dynamic import of modules - function used by the loader
		chunks: behaviour => import(`@/behaviours/${behaviour}`)
	}).mount()
})

log('HELLO')
