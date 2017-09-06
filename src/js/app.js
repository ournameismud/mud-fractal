import '@/plugins/logger'
// import '@/plugins/webfontloader'
import App from '@/core/loader'
import * as behaviours from '@/behaviours'

import 'lazysizes'

if(module.hot) {
	module.hot.accept()
}

log(module)

new App(document, behaviours).start()


document.body.style.backgroundColor = 'green'
