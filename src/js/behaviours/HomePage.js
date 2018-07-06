import Behaviour, { mix } from '@/core/Behaviour'
import {
	ScreenMixin,
	EventsMixin,
	RefsMixin,
	InviewMixin
} from '@/core/modules/'

export default class ExampleWithAllTheThings extends mix(Behaviour).with(
	ScreenMixin,
	EventsMixin,
	InviewMixin,
	RefsMixin
) {
	events = {
		'click [data-link]': 'onClick'
	}

	mount = () => {
		// this.$el === the node with the data-behaviour
		// this.$body === <body></body>
		// this.$html === <html></html>
		// this.KEY_CODES === common key codes
		// this.$data === any data attributes on this.$el
		// this.$$refs === Object containing any data-element="name" found inside the behaviour

		// attach all the vents
		this.$$events.attachAll()
		// or attach/remove an array of events this.$$events.attach(['click [data-link]'])
		// this.$$events.remove(['click [data-link]'])

		// watch data-element- viewport enter/exit methods get called
		this.$$inview.watch({
			selector: '[data-element]'
		})

		// call this to trigger the screens object to run on load
		this.$$eventBus.emit('window:resize')
	}

	onClick = (e, elm) => {
		e.preventDefault()
		elm.classList.toggle('huzzah')
	}

	screens = {
		'(min-width: 1024px)': ({ match, ...rest }) => {
			if (match) {
				log(rest)
			}
		}
	}

	unmount = () => {
		this.$el.classList.add('unmount')
	}

	viewport = {
		enter: node => {
			log('exit', node)
		},

		exit: node => {
			log('exit', node)
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
