import '@/plugins/logger'
import WebFontLoader from '@/plugins/webfontloader'
import App from '@/core/App'
import Router from '@/core/Router'
import routes from '@/views'

if (module.hot) {
	module.hot.accept()
}

WebFontLoader()

new App(document).mount()

document.getElementById('barba-container') &&
	new Router({
		routes,
		onChange: [],
		onReady: [],
		onComplete: [],
		navigation: ['header > ul', 'footer > ul'],
		activeClass: 'is-current',
		activeParentClass: 'is-current-child'
	}).start()
