import { composeProps } from '@/core/modules/refs'
import eventBus from '@/core/modules/eventBus'
import * as Actions from '@/core/router/actions'

/**
 * @namespace dom
 */

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
 *
 * @namespace Behavior
 * @description Behavior class to handle adding/removing functionality from the dom.
 * Use the mixins to add enhancements
 *
 * @class Behavior
 *
 * @param {HTMLElement} el - the html element to bind the behaviour too
 * @param {String} name - a name to give the behaviour
 *
 * @property {String} Behaviour.$name -  The name given to the behaviour
 * @property {HTMLElement} Behaviour.$el -  The element the behaviour is attached to
 * @property {HTMLElement} Behaviour.$body -  the body element
 * @property {HTMLElement} Behaviour.$html -  the html element
 * @property {Object} Behaviour.$data - any data attributes on the $el
 * @property {Function} Behaviour.$$$eventBus.on -  global event emitter, listen to events
 * @property {Function} Behaviour.$$$eventBus.off -  global event emitter, remove to events
 * @property {Function} Behaviour.$$$eventBus.emit -  global event emitter, emit event
 * @property {Object} Behavior.KEY_CODES
 * @property {Number} Behaviour.KEY_CODS.DELETE_KEY -  delete
 * @property {Number} Behaviour.KEY_CODS.SHIFT_KEY - shift
 * @property {Number} Behaviour.KEY_CODS.CTRL_KEY - control
 * @property {Number} Behaviour.KEY_CODS.ALT_KEY -  alt
 * @property {Number} Behaviour.KEY_CODS.RETURN_KEY - return
 * @property {Number} Behaviour.KEY_CODS.ESC_KEY - escape
 * @property {Number} Behaviour.KEY_CODS.SPACE_KEY - space
 * @property {Number} Behaviour.KEY_CODS.LEFT_KEY - left
 * @property {Number} Behaviour.KEY_CODS.UP_KEY - up
 * @property {Number} Behaviour.KEY_CODS.RIGHT_KEY - right
 * @property {Number} Behaviour.KEY_CODS.DOWN_KEY - down
 * @property {Number} Behaviour.KEY_CODS.CMD_KEY - command
 * @example
 * import Behaviour from '@/core/Behaviour'
 *
 * export default class ExampleWithAllTheThings Behaviour {
 * 	mount = () => {
 * 		// this.$el === the node with the data-behaviour
 * 		this.$el.classList.add('mount')
 * 		// this.$body === <body></body>
 * 		// this.$html === <html></html>
 * 		// this.KEY_CODES === common key codes
 * 		// this.$data === any data attributes on this.$el
 * 	}
 *
 * 	unmount = () => {}
 * }
 *
 * @return {Behavior}
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
