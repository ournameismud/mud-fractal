import Behaviour from '@/core/behaviour'

export default class Example extends Behaviour {
	constructor(el) {
		super(el)
		this.$events = this.$events(this.events)
		this.$events.attachAll()
		this.name = 'Example'
	}

	events = {
		'click [data-item]': 'funk'
	}

	funk = e => {
		e.preventDefault()
	}

	routes = {
		enter: () => {
			log('enter')
		},
		exit: () => {
			log('exit')
		}
	}
}
