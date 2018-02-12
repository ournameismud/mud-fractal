import Behaviour, { mix, DomEvents } from '@/core'
import Events from '@/core/events'

export default class ExampleWidthEvents extends mix(Behaviour).with(DomEvents) {
	constructor(el) {
		super(el)

		/*
      This function must be called to bind the events
    */
		this.addDomEvents()
	}

	events = {
		'click [data-item]': 'onClick'
	}

	onClick = (e, $hode) => {
		e.preventDefault()

		log('I\'m the element clicked:', $hode)

		Events.emit('custom:event', { test: 10 })
	}
}
