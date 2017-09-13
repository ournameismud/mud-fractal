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
