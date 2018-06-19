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
	const KEY_CODES = {
		DELETE_KEY: 8,
		SHIFT_KEY: 16,
		CTRL_KEY: 17,
		ALT_KEY: 18,
		RETURN_KEY: 13,
		ESC_KEY: 27,
		SPACE_KEY: 32,
		LEFT_KEY: 37,
		UP_KEY: 38,
		RIGHT_KEY: 39,
		DOWN_KEY: 40,
		A_KEY: 65,
		S_KEY: 83,
		CMD_KEY: 91
	}

	return class Behaviour {
		constructor(el = document, name = '') {
			this.$name = name
			this.$el = el
			this.$body = $body
			this.$html = $html

			this.$$eventBus = eventBus

			this.KEY_CODES = KEY_CODES

			this.$data = composeProps([...this.$el.attributes]) // here lies a bug
		}

		init() {
			if (this.routes) {
				this.$$eventBus.on(Actions.ROUTE_TRANSITION_ENTER, this.routes.enter)
				this.$$eventBus.on(Actions.ROUTE_TRANSITION_EXIT, this.routes.exit)
			}
		}

		mount = () => {}

		unmount = () => {}

		destroy() {
			this.unmount()

			if (this.routes) {
				this.$$eventBus.off(Actions.ROUTE_TRANSITION_ENTER, this.routes.enter)
				this.$$eventBus.off(Actions.ROUTE_TRANSITION_EXIT, this.routes.exit)
			}
		}
	}
})()
