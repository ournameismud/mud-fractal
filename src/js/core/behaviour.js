import createEvents from '@/core/modules/createEvents'
import refs, { composeProps } from '@/core/modules/refs'
import eventBus from '@/core/modules/eventBus'
import resizer from '@/core/modules/resizer'
import inview from '@/core/modules/inview'
import { ENGINE_METHOD_DIGESTS } from 'constants';

/**
 * class Behaviour
 *
 */
export default class Behaviour {
	constructor(el = document, name) {
		this.$name = name
		this.$el = el
		this.$eventBus = eventBus
		this.$data = composeProps([...this.$el.attributes])
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

		this.$eventBus.on('routes:enter', this.routes.enter)
		this.$eventBus.on('routes:exit', this.routes.exit)
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
		this.$eventBus.off('routes:enter', this.routes.enter)
		this.$eventBus.off('routes:exit', this.routes.exit)
		this.$screen.destroy()

		if (this.viewport) {
			this.$observer.destroy()

			delete this.$observer
		}

		if (this.events) {
			this.$events.destroy()

			delete this.$events
		}

		delete this.$eventBus
		delete this.$screen
	}
}
