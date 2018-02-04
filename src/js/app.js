import '@/plugins/logger'
import WebFontLoader from '@/plugins/webfontloader'
import Loader from '@/core/loader'
import Router from '@/core/router'
import routes from '@/views'

if (module.hot) {
	module.hot.accept()
}

WebFontLoader()

new Loader(document).mount()

document.getElementById('barba-container') &&
	new Router({
		routes,
		onChange: [],
		onReady: [],
		onComplete: [],
		navigation: ['header ul', 'footer ul'],
		activeClass: 'is-current',
		activeParentClass: 'is-current-child'
	}).start()
