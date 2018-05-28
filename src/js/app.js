import '@/plugins/logger'
import App from '@/core/App'
import routes from '@/views'

if (module.hot) {
	module.hot.accept()
}

new App({
	router: {
		routes,
		rootNode: document.getElementById('page-wrapper')
	},

	chunks: behaviour => import(`@/behaviours/${behaviour}`)
}).mount()
