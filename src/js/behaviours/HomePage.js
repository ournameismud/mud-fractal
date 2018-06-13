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

		// this.$$inview.watch({
		// 	selector: '[data-element]'
		// })
	}

	onClick = (e, elm) => {
		e.preventDefault()
		elm.classList.toggle('huzzah')
	}

	screens = {
		'(min-width: 1024px)': () => {}
	}

	unmount = () => {
		// log('unmount: HomePage')
		this.$el.classList.add('unmount')
	}

	viewport = {
		enter: item => {
			log(item)
		},

		exit: () => {
			log('exit')
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
