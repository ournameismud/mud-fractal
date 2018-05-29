import createEvents from '@/core/modules/createEvents'
import refs, { composeProps } from '@/core/modules/refs'
import eventBus from '@/core/modules/eventBus'
import resizer from '@/core/modules/resizer'
import inview from '@/core/modules/inview'
import * as Actions from '@/core/router/actions'

/**
 * class Behaviour
 *
 */
export default class Behaviour {
	constructor(el = document, name) {
		this.$name = name
		this.$el = el
		this.$eventBus = eventBus
		this.$data = composeProps([...this.$el.attributes]) // here lies a bug
	}

	registerObserverOptions = {}

	routes = {
		enter: () => {},
		exit: () => {}
	}

	viewport = {
		enter: () => {},
		exit: () => {}
	}

	screens = {}

	init = () => {
		this.$observer = inview(
			this.$el,
			this.viewport,
			this.registerObserverOptions
		)

		this.$eventBus.on(Actions.ROUTE_TRANSITION_ENTER, this.routes.enter)
		this.$eventBus.on(Actions.ROUTE_TRANSITION_EXIT, this.routes.exit)
		this.$refs = refs(this.$el)
		this.$screen = resizer(this.screens)
		if (this.events) {
			this.$events = createEvents.call(this, this.$el, this.events)
		}

		return this
	}

	updateRefs = () => {
		this.$refs = { ...this.$refs, ...refs(this.$el) }
	}

	mount = () => {}

	unmount = () => {}

	destroy = () => {
		this.unmount()
		this.$eventBus.off(Actions.ROUTE_TRANSITION_ENTER, this.routes.enter)
		this.$eventBus.off(Actions.ROUTE_TRANSITION_EXIT, this.routes.exit)
		this.$screen.destroy()

		if (this.viewport) {
			this.$observer.destroy()
		}

		if (this.events) {
			this.$events.destroy()
		}
	}
}
