import '@/plugins/logger'
import Example from '@/behaviours/ExampleClass'

if (module.hot) {
	module.hot.accept()
}

new Example(document.getElementById('test')).init()
