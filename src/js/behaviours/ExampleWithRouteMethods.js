import Behaviour, { mix, DomEvents } from '@/core'
import { Route } from '@/core/router'
import Events from '@/core/events'

export default class ExampleWidthEvents extends mix(Behaviour).with(
	DomEvents,
	Route
) {
	constructor(el) {
		super(el)

		/*
      This function must be called to bind the events
    */
		this.addDomEvents()

		/*
      This function must be called to bind the route (barba) events
    */
		this.withRoutes()

		Events.on('custom:event', (...args) => log(args))
	}

	onChange = (...args) => {
		log(args)
	}
	onReady = (...args) => {
		log(args)
	}
	onComplete = (...args) => {
		log(args)
	}

	events = {
		'click [data-item]': 'onClick'
	}

	onClick = (e, $hode) => {
		e.preventDefault()

		log('I\'m the element clicked:', $hode)
	}
}
