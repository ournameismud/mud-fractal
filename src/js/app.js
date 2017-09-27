import '@/plugins/logger'
import WebFontLoader from '@/plugins/webfontloader'
import App from '@/core/loader'
import * as behaviours from '@/behaviours'
import 'lazysizes'

if (module.hot) {
	module.hot.accept()
}

new WebFontLoader()
new App(document, behaviours).start()

/*
* Register Service Worker
*/
// if ('serviceWorker' in navigator) {
// 	navigator.serviceWorker
// 		.register('/sw.js')
// 		.then(reg => {
// 			log('Service Worker register', reg)
// 		})
// 		.catch(err => {
// 			log('Service Worker error', err)
// 		})
// }

thing()
