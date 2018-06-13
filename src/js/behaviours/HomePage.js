import Behaviour, { mix } from '@/core/Behaviour'
import { ScreenMixin } from '@/core/modules/resizer'
import { EventsMixin } from '@/core/modules/createEvents'
import { RefsMixin } from '@/core/modules/refs'
import { InviewMixin } from '@/core/modules/inview'

export default class HomePage extends mix(Behaviour).with(
	ScreenMixin,
	EventsMixin,
	InviewMixin,
	RefsMixin
) {
	events = {
		'click [data-link]': 'onClick'
	}
	mount = () => {
		this.$$events.attachAll()

		const $node = document.createElement('pre')

		$node.innerHTML = JSON.stringify(this.$$refs, null, 2)

		this.$el.appendChild($node)
	}

	onClick = (e, elm) => {
		e.preventDefault()
		elm.classList.toggle('huzzah')
		log('HELLO')
	}

	screens = {
		'(min-width: 1024px)': ({ match, width, height, query }) => {
			log('(min-width: 1024px)', match, width, height, query)
		},

		'(min-width: 680px)': ({ match, width, height, query }) => {
			log('(min-width: 680px)', match, width, height, query)
		}
	}

	unmount = () => {
		// log('unmount: HomePage')
		this.$el.classList.add('unmount')
	}

	viewport = {
		enter: () => {
			log('ExampleClass enter')
		},

		exit: () => {
			log('ExampleClass exit')
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
}
