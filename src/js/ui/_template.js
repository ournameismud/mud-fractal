import { createEvents } from '@/core/modules/createEvents'
import mitt from 'mitt'

/** *
 * @namespace MyUiWidget
 * @class MyUiWidget
 * @desc This class handles MyUiWidgets... 
 * @example 
 * 
 * js: 
 * 
 * new MyUiWidget(document.getElementById('test'), {}, 'test-node').mount()
 * 
 * Required markup:
 * 
 * <div id="test" data-ui="MyUiWidget" data-ui-options='{}' data-ui-key="menu-MyUiWidget"></div>
 *

 * @param {HTMLElement} el - node to bind to
 * @param {Object} options - options
 * @param {String} key - key name
 *
 * @property {Boolean} options.XXX - only allow one MyUiWidget to be open at a time
 * @property {Number} options.XXX - set one of the MyUiWidgets to be open
 * 
 * @return {MyUiWidget}
 */

export default class MyUiWidget {
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
	 * @memberof MyUiWidget
	 * @method mount
	 * @desc Add the events
	 *
	 * @return {void}
	 */
	mount = () => {
		this.$$events.attachAll()
	}

	events = {
		'click [data-my-button]': 'onClick'
	}

	/** *
	 * @memberof MyUiWidget
	 * @method unmount
	 * @desc remove the events
	 *
	 * @return {void}
	 */
	unmount = () => {
		this.$$events.destroy()
	}

	/** *
	 * @memberof MyUiWidget
	 * @method onClick
	 * @desc the click event...
	 * @param {Object} e : the event object
	 * @param {HTMLElement} elm : the node clicked
	 *
	 * @return {void}
	 */
	onClick = (e, elm) => {}
}
