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
 * Create a router
 * @namespace Behavior
 *
 * @class Behavior
 *
 * @property {HTMLElement} el - the html element to bind the behaviour too
 * @property {String} name - a name to give the behaviour
 *
 * @return {Behaviour}
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

			this.$data = this.$el.attributes
				? composeProps([...this.$el.attributes])
				: null // here lies a bug
		}

		/**
		 * Create a router
		 * @memberof Behavior
		 *
		 * @method init
		 * @description initialise the router events
		 * @return {void}
		 */
		init() {
			if (this.routes) {
				if (this.routes.enter)
					this.$$eventBus.on(Actions.ROUTE_TRANSITION_ENTER, this.routes.enter)

				if (this.routes.exit)
					this.$$eventBus.on(Actions.ROUTE_TRANSITION_EXIT, this.routes.exit)
			}
		}

		/**
		 * Create a router
		 * @memberof Behavior
		 *
		 * @method mount
		 * @description called after instantiation
		 * @return {void}
		 */
		mount() {} // eslint-disable-line class-methods-use-this

		/**
		 * Create a router
		 * @memberof Behavior
		 *
		 * @method unmount
		 * @description called when destroying
		 * @return {void}
		 */
		unmount() {} // eslint-disable-line class-methods-use-this

		/**
		 * Create a router
		 * @memberof Behavior
		 *
		 * @method destroy
		 * @description kill the current behaviour
		 * @return {void}
		 */
		destroy() {
			this.unmount()

			if (this.routes) {
				if (this.routes.enter)
					this.$$eventBus.off(Actions.ROUTE_TRANSITION_ENTER, this.routes.enter)

				if (this.routes.exit)
					this.$$eventBus.off(Actions.ROUTE_TRANSITION_EXIT, this.routes.exit)
			}
		}
	}
})()
