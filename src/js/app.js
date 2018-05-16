import '@/plugins/logger'
import eventBus from '@/core/eventBus'
import Example from '@/behaviours/ExampleClass'

if (module.hot) {
	module.hot.accept()
}

new Example(document.getElementById('test')).init()
