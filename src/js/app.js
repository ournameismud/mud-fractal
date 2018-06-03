import '@/plugins/logger'
import App from '@/core/App'
import routes from '@/views'

if (module.hot) {
	module.hot.accept()
}

new App({
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
		}
	},

	chunks: behaviour => import(`@/behaviours/${behaviour}`)
}).mount()
