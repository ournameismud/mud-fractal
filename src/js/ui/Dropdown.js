import { createEvents } from '@/core/modules/createEvents'
import eventPromise from '@/utils/eventPromise'
import animationEnd from '@/utils/animationEnd'
import mitt from 'mitt'

/** *
 * @class DropDown
 * @desc This class handles dropdowns...
 * @example /04-components/dropdown
 *
 * Required markup:
 *
 * <div data-ui="Dropdown" data-ui-options='{"update-text": true, "intercept-links": true}' data-ui-key="downloads-dropdown">
 * 	<button data-dropdown-button>
 * 		<span class="mr-1" data-dropdown-text>View all products</span>
 * 	</button>
 * 	<div data-dropdown-menu>
 * 		<ul class="list-reset">
 * 			<li data-dropdown-reset role="button" tabindex="0">Reset</li>
 * 			<li>
 * 				<a data-dropdown-item>item</a>
 * 			</li>
 * 			<li>
 * 				<a data-dropdown-item>item</a>
 * 			</li>
 * 			<li>
 * 				<a data-dropdown-item>item</a>
 * 			</li>
 * 		</ul>
 * 	</div>
 * </div>
 *
 * @param {HTMLElement} - node to bind to
 * @param {Object} - options
 * @param {String} - key name
 *
 * @return {DropDown}
 */

export default class DropDown {
	defaults = {
		updateText: false,
		interceptLinks: false,
		closeOnClick: true
	}

	constructor(el, options, key) {
		this.options = { ...this.defaults, ...options }
		this.key = key

		Object.assign(this, mitt())

		this.$el = el
		// bind the dom events
		this.$$events = createEvents.call(this, this.$el, this.events)

		this.$reset = this.$el.querySelector('[data-dropdown-reset]')
		this.$label = this.$el.querySelector('[data-dropdown-text]')
		this.$button = this.$el.querySelector('[data-dropdown-button]')
		this.$dropdown = this.$el.querySelector('[data-dropdown-menu]')
		this.$items = [...this.$el.querySelectorAll('[data-dropdown-item]')]

		this.originalText = this.$label.textContent

		// the state machine... will always invoke the next stage of state
		// https://en.wikipedia.org/wiki/Finite-state_machine
		this.machine = {
			open: { CLICK: 'close' },
			close: { CLICK: 'open' }
		}

		// set the inital state
		this.state = 'close'

		this.$selectedItem = null
	}

	/** *
	 * @method mount
	 * @desc Add the events
	 *
	 * @return {void}
	 */
	mount = () => {
		this.$$events.attachAll()
	}

	/** *
	 * @method mount
	 * @desc removes the events
	 *
	 * @return {void}
	 */
	unmount = () => {
		this.$$events.destroy()
		this.off('*')
	}

	events = {
		'click [data-dropdown-button]': 'onClick',
		'blur [data-dropdown-item]': 'onBlur',
		'click [data-dropdown-item]': 'onItemClick',
		'click [data-dropdown-reset]': 'onResetClick'
	}

	/** *
	 * @method onClick
	 * @desc the click event...
	 * @param {Object} : the event object
	 *
	 * @return {void}
	 */
	onClick = e => {
		e.preventDefault()

		const action = this.machine[this.state].CLICK

		this[action]()

		this.state = action
	}

	/** *
	 * @method onBlur
	 * @desc the blur event... this is used to close the dropdown when clicking outside
	 *
	 * @return {void}
	 */

	onBlur = () => {
		// must be wrapped in a setTimeout
		setTimeout(() => {
			// if the active node is the button, do nothing
			if (document.activeElement === this.$button) return

			// if the active node is outside of the dropdown
			// close it, reset the state
			if (!document.activeElement.closest('[data-dropdown-menu]')) {
				this.state = 'close'
				this.close()
			}
		})
	}

	/** *
	 * @method onItemClick
	 * @desc handle various options, this is only called when intercept links is true
	 * @param {Object} : the event object
	 * @param {HTMLElement} : the element clicked
	 *
	 * @return {void}
	 */
	onItemClick = (e, elm) => {
		const { interceptLinks, updateText, closeOnClick } = this.options

		if (this.$selectedItem && this.$selectedItem !== elm) {
			this.$selectedItem.classList.remove('is-selected')
		}

		if (interceptLinks) {
			e.preventDefault()
			this.emit('dropdown:item:clicked', { elm, key: this.key })
		}

		if (updateText) {
			const text = elm.textContent.trim()
			this.$label.textContent = text
		}

		if (closeOnClick) {
			this.close().then(() => {
				if (updateText) {
					this.$reset.style.display = 'block'
				}
			})
		}

		elm.classList.add('is-selected')

		this.$selectedItem = elm
	}

	/** *
	 * @method onResetClick
	 * @desc reset the dropdown label text and close
	 * @param {Object} : the event object
	 *
	 * @return {void}
	 */

	onResetClick = e => {
		e.preventDefault()
		this.$label.textContent = this.originalText

		if (this.$selectedItem) {
			this.$selectedItem.classList.remove('is-selected')
		}

		this.close().then(() => {
			this.$reset.style.display = ''
		})
	}

	/** *
	 * @method open
	 * @desc open the dropdown, once the animation has finished set the focus state
	 *
	 * @return {Promise}
	 */

	open = () => {
		this.$button.classList.add('is-active')

		return eventPromise(animationEnd('transition'), this.$dropdown, () => {
			this.$dropdown.classList.add('is-open')
		}).then(() => {
			this.$items[0].focus()
		})
	}

	/** *
	 * @method close
	 * @desc close the dropdown
	 *
	 * @return {void}
	 */

	close = () =>
		eventPromise(animationEnd('transition'), this.$dropdown, () => {
			this.$button.classList.remove('is-active')
			this.$dropdown.classList.remove('is-open')
			this.state = 'close'
		})
}
