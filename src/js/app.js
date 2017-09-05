import debug from 'debug'
import WebFont from 'webfontloader'
import 'lazysizes'
import * as behaviours from './behaviours'
import App from './core/loader'


// logs enabled during development
window.log = debug('app:log')
if(process.env.NODE_ENV === 'development') {
	debug.enable('app:log')
} else {
	debug.disable('app:log')
}
log(`Logging is enabled!, NODE_ENV: ${process.env.NODE_ENV}`)


if(module.hot) {
	module.hot.accept()
}




WebFont.load({
	typekit: {
		id: 'wwe2tnw'
	},
	custom: {
		families: [
			'apercu-mono',
			'FoundersGroteskCondensedWeb-Bold',
			'FoundersGroteskCondensedWeb-Light',
			'FoundersGroteskCondensedWeb-Semibold'
		],
		urls: ['/dist/css/fonts.css']
	}
})

new App(document, behaviours)
	.start()
	.watch()

