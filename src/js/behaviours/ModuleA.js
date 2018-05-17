import Behaviour from '@/core/behaviour'

export default class ModuleA extends Behaviour {
	mount = () => {
		this.$events.attachAll()
	}

	events = {
		'click [data-link]': 'onClick'
	}

	onClick = (e, elm) => {
		e.preventDefault()
		elm.classList.add('huzzah')
	}
}
