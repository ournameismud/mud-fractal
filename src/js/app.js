import '@/plugins/logger'
// import '@/plugins/webfontloader'
import App from '@/core/loader'
import * as behaviours from '@/behaviours'

import 'lazysizes'

if(module.hot) {
	module.hot.accept()
}

new App(document, behaviours).start()
