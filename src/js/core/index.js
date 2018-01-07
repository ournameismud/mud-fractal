import { isFn, MixinBuilder } from './utils'

export { DomEvents } from './DomEvents'

export const mix = superclass => new MixinBuilder(superclass)

export default class Behaviour {
	constructor($el = document, options = {}) {
		this.options = options
		this.$el = $el
		return this
	}

	autoBindEvents = true

	initialize = () => {
		if (this.events && this.autoBindEvents) {
			this.addDomEvents()
		}

		setTimeout(() => this.mounted())

		return this
	}

	destroy = () => {
		if (isFn(this.unmount)) this.unmount()

		if (this.events) {
			this.removeDomEvents()
		}

		return this
	}

	mounted = () => {}

	unmount = () => {}
}
