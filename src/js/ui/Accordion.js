import { createEvents } from '@/core/modules/createEvents'
import mitt from 'mitt'

/** *
 * @namespace Accordion
 * @class Accordion
 * @desc This class handles accordions... 
 * @example 
 * 
 * js: 
 * 
 * new Accordion(document.getElementById('accordion'), { 
 * 	closeOthers: true 
 * }, 'ui-key').mount()
 * 
 * Required markup:
 * 
 * <ul data-ui="Accordion" data-ui-options='{"close-others": true, "active-index": 1}' data-ui-key="downloads-accordion">
		<li>
			<a href="#bt1" data-accordion-button>Datasheets</a>
			<ul class="list-reset hidden" data-accordion-dropdown id="bt1">...</ul>
		</li>
		<li>
			<a href="#bt2" data-accordion-button>Datasheets</a>
			<ul class="list-reset hidden" data-accordion-dropdown id="bt2">...</ul>
		</li>
		<li>
			<a href="#bt3" data-accordion-button>Datasheets</a>
			<ul class="list-reset hidden" data-accordion-dropdown id="bt3">...</ul>
		</li>
	</ul>
 *

 * @param {HTMLElement} el - node to bind to
 * @param {Object} options - options
 * @param {String} key - key name
 *
 * @property {Boolean} options.closeOthers - only allow one accordion to be open at a time
 * @property {Number} options.activeIndex - set one of the accordions to be open
 * 
 * @return {Accordion}
 */

export default class Accordion {
	defaults = {
		closeOthers: false,
		activeIndex: undefined
	}

	constructor(el, options, key) {
		this.options = { ...this.defaults, ...options }
		this.key = key

		Object.assign(this, mitt())

		this.$el = el
		// bind the dom events
		this.$$events = createEvents.call(this, this.$el, this.events)

		this.$selectedIndex = undefined

		this.$panels = [
			...this.$el.querySelectorAll('[data-accordion-button]')
		].map((button, index) => {
			const href = button.getAttribute('href')
			const target = this.$el.querySelector(href)

			button.setAttribute('data-accordion-key', index)

			return {
				button,
				target,
				machine: {
					open: { CLICK: 'close' },
					close: { CLICK: 'open' }
				},
				state: this.options.activeIndex === index ? 'open' : 'close'
			}
		})

		if (typeof this.options.activeIndex !== 'undefined') {
			this.open(this.options.activeIndex)
			this.$selectedIndex = this.options.activeIndex
		}
	}

	/** *
	 * @memberof Accordion
	 * @method mount
	 * @desc Add the events
	 *
	 * @return {void}
	 */
	mount = () => {
		this.$$events.attachAll()
	}

	events = {
		'click [data-accordion-button]': 'onClick'
	}

	/** *
	 * @memberof Accordion
	 * @method unmount
	 * @desc remove the events
	 *
	 * @return {void}
	 */
	unmount = () => {
		this.$$events.destroy()
	}

	/** *
	 * @memberof Accordion
	 * @method onClick
	 * @desc the click event...
	 * @param {Object} e : the event object
	 * @param {HTMLElement} elm : the node clicked
	 *
	 * @return {void}
	 */
	onClick = (e, elm) => {
		e.preventDefault()
		const { closeOthers } = this.options
		const { accordionKey } = elm.dataset
		const key = parseInt(accordionKey, 10)
		// get the current state
		const { state } = this.$panels[key]
		// get the new action
		const action = this.$panels[key].machine[state].CLICK

		// if close others, and we have some to close... close it
		if (
			closeOthers &&
			typeof this.$selectedIndex !== 'undefined' &&
			this.$selectedIndex !== key
		) {
			this.close(this.$selectedIndex)
		}

		// do the new action
		this[action](key)

		// update the selected item ref
		this.$selectedIndex = key
	}

	/** *
	 * @memberof Accordion
	 * @method open
	 * @desc Open the accordion
	 * @param {Number} index : index of the accordion to open
	 *
	 * @return {void}
	 */
	open = index => {
		this.$panels[index].state = 'open'
		const { button, target } = this.$panels[index]

		button.classList.add('is-active')
		target.style.display = 'block'
		// target.querySelectorAll('a')[0].focus()
	}

	/** *
	 * @memberof Accordion
	 * @method close
	 * @desc Close the accordion
	 * @param {Number} index : index of the accordion to close
	 *
	 * @return {void}
	 */
	close = index => {
		this.$panels[index].state = 'close'
		const { button, target } = this.$panels[index]

		button.classList.remove('is-active')
		button.focus()
		target.style.display = ''
	}
}
