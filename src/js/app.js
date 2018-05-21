import '@/plugins/logger'

// import eventBus from '@/core/eventBus'
// import Example from '@/behaviours/ExampleClass'

import loader from '@/core/loader'
import Router from '@/core/router'

const load = loader('@/behaviours/')

load.hydrate(document)

if (module.hot) {
	module.hot.accept()
}

new Router().mount()
