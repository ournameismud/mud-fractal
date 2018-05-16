import createEvents from '@/core/createEvents'
import refs from '@/core/refs'
import eventBus from '@/core/eventBus'

export default class Behaviour {
	constructor(el = document) {
		this.$el = el
		this.$refs = refs(this.$el)
		this.$events = createEvents.call(this, this.$el)
		this.$eventBus = eventBus
	}

	routes = {
		enter: () => {
			log('e')
		},
		exit: () => {}
	}

	init = () => {
		this.$eventBus.on('routes:enter', this.routes.enter)
		this.$eventBus.on('routes:exit', this.routes.exit)
		return this
	}

	updateRefs = () => {
		this.$refs = { ...this.$refs, ...refs(this.$el) }
	}

	mount = () => {}

	unmount = () => {}

	destroy = () => {
		this.unmount()

		if (this.$events.destroy) {
			this.$events.destroy()
		}
	}
}
