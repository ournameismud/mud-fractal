import { composeProps } from '@/core/modules/refs'
import eventBus from '@/core/modules/eventBus'
import * as Actions from '@/core/router/actions'

class MixinBuilder {
	constructor(superclass) {
		this.superclass = superclass
	}

	with(...mixins) {
		return mixins.reduce((c, mixin) => mixin(c), this.superclass)
	}
}

export const mix = superclass => new MixinBuilder(superclass)

/**
 * class Behaviour
 *
 */
export default (() => {
	const $html = document.getElementsByTagName('html')[0]
	const $body = document.body

	return class Behaviour {
		constructor(el = document, name = '') {
			this.$name = name
			this.$el = el
			this.$body = $body
			this.$html = $html

			this._eventBus = eventBus

			this.$data = composeProps([...this.$el.attributes]) // here lies a bug
		}

		init() {
			if (this.routes) {
				this._eventBus.on(Actions.ROUTE_TRANSITION_ENTER, this.routes.enter)
				this._eventBus.on(Actions.ROUTE_TRANSITION_EXIT, this.routes.exit)
			}
		}

		mount() {}

		unmount() {}

		destroy() {
			this.unmount()

			if (this.routes) {
				this._eventBus.off(Actions.ROUTE_TRANSITION_ENTER, this.routes.enter)
				this._eventBus.off(Actions.ROUTE_TRANSITION_EXIT, this.routes.exit)
			}
		}
	}
})()
