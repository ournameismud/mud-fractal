import Concert from 'concert'
import Delegate from 'dom-delegate'
import { mergeOptions, fromTo } from '@/utils/helpers'


/**
 * 
 * @class Expander
 * @extends  Concert
 * @param  {HTMLElement} el : the form to validate
 * @param  {Object} options : accordion options
 * 									activeIndex: Number // Set the inital active pane
 * 									closeOthers: Boolean // set to true to ensure only one pane is ever open
 * 									selector: String // css selector for each accordion button
 * 									name: String // name used for accessibility props
 * 									buttonActiveClass: String // active button class
 * 									contentActiveClass: String // active content class
 * 									duration: Number // Animation duration
 * 									easing: Function // easing function to apply
 */
export default class Expander extends Concert {

	defaults = {
		activeIndex: null,
		closeOthers: false,
		open: false,
		selector: '[data-accordion-btn]',
		name: 'accordion',
		init: true,
		buttonActiveClass: 'is-active',
		contentActiveClass: 'is-expanded',
		duration: 300,
		easing: function defaultEasing(t, b, c, d) {
			if((t /= d / 2) < 1) return c / 2 * t * t + b
			return -c / 2 * ((--t) * (t - 2) - 1) + b // eslint-disable-line
		}
	}

	/**
	 * 
	 * @function constructor
	 * @param  {HTMLElement} el : the form to validate
	 * @param  {Object} options : Expander options
	 * @return Expander
	 */
	constructor(el, options = {}) {
		super()
		this.options = mergeOptions(this.defaults, options, el, 'accordionOptions')
		this.$el = el
		this.panes = []
		this.current
		this.delegate = new Delegate(el)
		this.options.init && this.initalize()
	}

	/**
	 * Setup panels, add accessibility attributes
	 *
	 * @return {void}
	 */
	createPanels = () => {
		const {
			buttonActiveClass,
			contentActiveClass,
			activeIndex,
			open,
			name
		} = this.options

		this.panes = [...this.$el.querySelectorAll(this.options.selector)].map(($button, index) => {
			$button.setAttribute('data-accordion-index', index)
			const { target } = $button.dataset
			const $target = this.$el.querySelector(target)
			const state = open 
				? true
				: (!open && index === activeIndex ? true : false) 
					? true
					: false
			$button.setAttribute('aria-expanded', state)
			$button.setAttribute('aria-selected', state)
			$button.setAttribute('aria-controls', `${name}-${index}`)
			if(state) {
				$button.classList.add(buttonActiveClass)
				$target.classList.add(contentActiveClass)
			}
			$target.setAttribute('aria-labelledby', `${name}-${index}`)
			$target.setAttribute('aria-hidden', !state)
			$target.setAttribute('role', 'tabpanel')	
			return {
				$button,
				$target,
				index,
				open: state,
				isRunning: false
			}
		})
	}
	
	/**
	 * function called after the transition has completed
	 *
	 * @return {Expander}
	 */
	onEnd = (pane) => {
		const { $target, $button, open } = pane
		$target.style.willChange = ''
		$target.style.height = ''
		$target.style.display = ''
		pane.isRunning = false
		$button.setAttribute('aria-expanded', open)
		$button.setAttribute('aria-selected', open)
		$target.setAttribute('aria-hidden', !open)

		return this
	}

	/**
	 * Bind event listeners
	 *
	 * @function addEvents
	 * @return {Expander}
	 */
	addEvents = () => {
		const { selector } = this.options
		this.delegate.on('click', selector, this.clickHandle)

		return this
	}

	/**
	 * Unbind event listeners
	 *
	 * @function removeEvents
	 * @return {Expander}
	 */
	removeEvents = () => {
		const { selector } = this.options
		this.delegate.off('click', selector, this.clickHandle)

		return this
	}

	/**
	 * The 'change' event handler
	 * 
	 * @function clickHandle
	 * @param  {Object} event : event object
	 * @param  {HTMLElement} element : the input that's changed
	 * @return Void
	 */
	clickHandle = (event, element) => {
		event.preventDefault()
		const { closeOthers } = this.options
		const { accordionIndex } = element.dataset
		const open = element.getAttribute('aria-expanded') === 'true' ? true : false
		if(closeOthers && this.current) {
			const { index } = this.current
			if(index !== parseInt(accordionIndex)) this.collapse(index)
		}
		open === true ? this.collapse(accordionIndex) : this.expand(accordionIndex)
		this.current = this.panes[accordionIndex]
	}

	/**
	 * 
	 * @function expand
	 * @param  {Number} index : the form to validate
	 * @return {Expander}
	 */
	expand = (index) => {
		const pane = this.panes[index]
		const { duration, easing, buttonActiveClass, contentActiveClass } = this.options
		if(!pane.isRunning) {
			const { $target, $button } = pane
			$target.style.display = 'block'
			const { height } = $target.getBoundingClientRect()
			$target.style.height = 0
			$target.style.willChange = 'height'
			pane.isRunning = true
			pane.open = true

			this.trigger('accordion:open')

			fromTo({
				start: 0,
				end: Math.round(height),
				duration: duration,
				easing: easing
			}, (v) =>  $target.style.height = `${v}px`).then(() => {
				this.onEnd(pane)
				$button.classList.add(buttonActiveClass)
				$target.classList.add(contentActiveClass)
				this.trigger('accordion:opened')
			})
		}

		return this
	}

	/**
	 * 
	 * @function expand
	 * @param  {Number} index : the form to validate
	 * @return {Expander}
	 */
	collapse = (index) => {

		const { duration, easing, buttonActiveClass, contentActiveClass } = this.options
		const pane = this.panes[index]
		if(!pane.isRunning) {
			pane.open = false
			const { $target, $button } = pane
			const { height } = $target.getBoundingClientRect()
			$target.style.height = `${height}px`
			$target.style.willChange = 'height'

			this.trigger('accordion:collapse')
			
			pane.isRunning = true
			fromTo({
				start: Math.round(height),
				end: 0,
				duration: duration,
				easing: easing
			}, (v) =>  $target.style.height = `${v}px`).then(() => {
				this.onEnd(pane)
				$button.classList.remove(buttonActiveClass)
				$target.classList.remove(contentActiveClass)
				this.trigger('accordion:collapsed')
			})
		}

		return this
	}

	/**
	 * Initalize accordion, add aria attributes, bind events, open/close etc etc
	 *
	 * @return {Expander}
	 */
	initalize = () => {
		this.addEvents()
		this.$el.setAttribute('role', 'tablist')
		this.$el.setAttribute('aria-multiselectable', this.options.closeOthers)
		this.createPanels()

		this.trigger('accordion:initalize')

		return this
	}

	/**
	 * Initalize accordion, add aria attributes, bind events, open/close etc etc
	 *
	 * @return {Expander}
	 */
	destroy = () => {
		const { buttonActiveClass, contentActiveClass } = this.options
		this.removeEvents()
		this.$el.removeAttribute('role')
		this.$el.removeAttribute('aria-multiselectable')
		this.panes.forEach(({$button, $target}) => {
			$button.classList.remove(buttonActiveClass)
			$button.removeAttribute('aria-expanded')
			$button.removeAttribute('aria-selected')
			$button.removeAttribute('aria-controls')
			$button.removeAttribute('role', 'tab')
			$target.removeAttribute('aria-hidden')
			$target.removeAttribute('aria-labelledby')
			$target.removeAttribute('role', 'tabpanel')
			$target.classList.remove(contentActiveClass)
			$target.removeAttribute('style')
		})

		this.trigger('accordion:destroy')

		return this
	}
}

