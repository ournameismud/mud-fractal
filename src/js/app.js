import '@/plugins/logger'
// import WebFontLoader from '@/plugins/webfontloader'
import Loader from '@/core/loader'

import Router from '@/core/router'
import routes from '@/views'

if (module.hot) {
	module.hot.accept()
}

// WebFontLoader()

const app = new Loader(document)
const $container = document.getElementById('barba-wrapper')
// document for first mount call
let root = document

if ($container) {
	new Router({
		routes,
		transitionOnLoad: true,
		onChange: [app.unmount],
		onReady: [
			() => {
				app.mount(root)
				root = $container
			}
		],
		onComplete: [],
		navigation: ['header nav', 'footer > ul'],
		currentClass: 'is-current',
		currentParentClass: 'is-current-child'
	}).start()
} else {
	app.mount()
}

/*
	Service worker chuff... 
	
	(function() {
		if ('serviceWorker' in navigator) {
			window.addEventListener('load', () => {
				navigator.serviceWorker
					.register('/sw.js')
					.then(registration => {
						log('SW registered: ', registration)
					})
					.catch(registrationError => {
						console.warn('SW registration failed: ', registrationError)
					})
			})
		}
	})()

*/
