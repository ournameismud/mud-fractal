import Behaviour, { mix } from '@/core/Behaviour'
import { ResizeMixin } from '@/core/modules/resizer'

export default class HomePage extends Behaviour {
	mount = () => {
		// log('mount: HomePage')
		this.$el.classList.add('mount')
		this.$events.attachAll()

		log('hello')
		// this.$screen.on('window:resize', ({ width, height, query }) => {
		// 	// log({ width, height, query })
		// })
	}

	unmount = () => {
		// log('unmount: HomePage')
		this.$el.classList.add('unmount')
	}

	events = {
		'click [data-link]': 'onClick'
	}

	onClick = (e, elm) => {
		e.preventDefault()
		elm.classList.toggle('huzzah')
	}

	viewport = {
		enter: () => {
			// log('ExampleClass enter')
		},

		exit: () => {
			// log('ExampleClass exit')
		}
	}

	routes = {
		enter: () => {
			this.$el.classList.toggle('enter')
		},
		exit: () => {
			this.$el.classList.toggle('exit')
		}
	}

	screens = {
		'(min-width: 1024px)': ({ match, width, height, query }) => {
			log('(min-width: 1024px)', match, width, height, query)
		},

		'(min-width: 680px)': ({ match, width, height, query }) => {
			log('(min-width: 680px)', match, width, height, query)
		}
	}
}
