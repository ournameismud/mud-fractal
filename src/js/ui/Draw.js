import { createEvents } from '@/core/modules/createEvents'
import mitt from 'mitt'

/** *
 * @namespace Draw
 * @class Draw
 * @desc This class handles Draws...
 * @example
 *
 * js:
 *
 * new Draw(document.getElementById('test'), {}, 'test-node').mount()
 *
 * Required markup:
 *
 * <a href="#test" data-ui="Draw" data-ui-options='{}' data-ui-key="menu-draw"></a>
 * <div id="test"></div>
 *
 * maybe?.. maybe data-attributes...
 * hmmm... nah.. id me thinks
 *
 * @param {HTMLElement} el - node to bind to
 * @param {Object} options - options
 * @param {String} key - key name
 *
 * @property {Boolean} options.XXX - only allow one Draw to be open at a time
 * @property {Number} options.XXX - set one of the Draws to be open
 *
 * @return {Draw}
 */

export default class Draw {
	defaults = {}

	constructor(el, options, key) {
		this.options = { ...this.defaults, ...options }
		this.key = key

		Object.assign(this, mitt())

		this.$el = el
		// bind the dom events
		this.$$events = createEvents.call(this, this.$el, this.events)
	}

	/** *
	 * @memberof Draw
	 * @method mount
	 * @desc Add the events
	 *
	 * @return {void}
	 */
	mount = () => {
		this.$$events.attachAll()
	}

	events = {
		'click [data-draw-toggle]': 'onClick'
	}

	/** *
	 * @memberof Draw
	 * @method unmount
	 * @desc remove the events
	 *
	 * @return {void}
	 */
	unmount = () => {
		this.$$events.destroy()
	}

	/** *
	 * @memberof Draw
	 * @method onClick
	 * @desc the click event...
	 * @param {Object} e : the event object
	 * @param {HTMLElement} elm : the node clicked
	 *
	 * @return {void}
	 */
	onClick = (e, elm) => {}

	/** *
	 * @memberof Draw
	 * @method open
	 * @desc Open the Draw
	 *
	 * @return {void}
	 */
	open = () => {}

	/** *
	 * @memberof Draw
	 * @method close
	 * @desc Close the Draw
	 *
	 * @return {void}
	 */
	close = () => {}
}
