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
	 * @prop :array : routes object
	 * @prop :HTMLElement  : the root html node
	 * @prop :array  :  an array of links that should update on navigation
	 * @prop :object  :  clases applied to active links
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
		onExit() {
			log('ON EXIT')
		},
		onEnter() {
			log('ON ENTER')
		}
	},

	/***
	 * chunks
	 *
	 * @prop :chunks : dynamic import of modules - function used by the loader
	 *
	 */
	chunks: behaviour => import(`@/behaviours/${behaviour}`)
}).mount()
