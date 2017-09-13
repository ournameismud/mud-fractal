import Concert from 'concert'
import { transitionEnd } from '@/utils/dom'
import { lock } from '@/utils/helpers'
import { mergeOptions } from '@/utils/helpers'

/**
 * @class SideNav
 * @extends  Concert
 * @param  {HTMLElement} el : menu button
 * @param  {Object} options : menu options
 */
export default class SideNav extends Concert {
	defaults = {
		inner: document.getElementById('menu-inner'),
		canvas: document.getElementById('menu-canvas'),
		closer: document.getElementById('closeBtn'),
		init: false,
		lock: true,
		clickOutside: true,
		buttonActiveClass: 'is-active',
		canvasActiveClass: 'is-visible',
		canvasAnimatingClass: 'is-animating'
	}

	/**
	 * The constructor
	 * 
	 * @function constructor
	 * @param {HTMLElement} button
	 * @param {Object} options
	 * @return SideNav
	 */
	constructor(button, options = {}) {
		super()
		this.$body = document.querySelector('body')
		this.$html = document.querySelector('html')
		this.options = mergeOptions(
			this.defaults,
			options,
			button,
			'sidenavOptions'
		)
		this.isVisible = false
		this.$inner = this.options.inner
		this.$canvas = this.options.canvas
		this.$closer = this.options.closer
		this.$button = button
		this.events = ['before:open', 'after:open', 'before:close', 'after:close']
		this.options.init && this.initialize()
		this.enabled = false
		if (this.options.lock) this.lock = lock()
	}

	/**
	 * Bind Events
	 * 
	 * @function addEvents
	 * @return SideNav
	 */
	addEvents = () => {
		const { clickOutside } = this.options
		if (clickOutside && this.$inner) {
			this.$canvas.addEventListener('click', this.hideSideNav)
			this.$inner.addEventListener('click', this.blockClicks)
		}
		if (this.$closer) this.$closer.addEventListener('click', this.hideSideNav)
		this.$button.addEventListener('click', this.onButtonClick)
		return this
	}

	/**
	 * Remove Events
	 * 
	 * @function addEvents
	 * @return SideNav
	 */
	removeEvents = () => {
		const { clickOutside } = this.options
		if (clickOutside && this.$inner) {
			this.$canvas.removeEventListener('click', this.hideSideNav)
			this.$inner.removeEventListener('click', this.blockClicks)
		}
		if (this.$closer)
			this.$closer.removeEventListener('click', this.hideSideNav)
		this.$button.removeEventListener('click', this.onButtonClick)
		return this
	}

	/**
	 * Button click handle
	 * 
	 * @function onButtonClick
	 * @param {Object} e - click event object
	 * @return void
	 */
	onButtonClick = e => {
		e.preventDefault()
		this.isVisible ? this.hideSideNav() : this.showSideNav()
	}

	/**
	 * Prevent clicks from propogating 
	 * 
	 * @function {Object} e - click event object
	 * @return void
	 */
	blockClicks = e => {
		e.stopPropagation()
	}

	/**
	 * Animate in the canvas
	 * 
	 * @function showSideNav
	 * @return void
	 */
	showSideNav = () => {
		const {
			buttonActiveClass,
			canvasActiveClass,
			canvasAnimatingClass,
			lock
		} = this.options

		if (lock) this.lock.capture()

		this.trigger('before:open')
		this.$button.classList.add(buttonActiveClass)
		this.$canvas.classList.add(canvasAnimatingClass)
		this.$canvas.classList.add(canvasActiveClass)
		this.$canvas.addEventListener(transitionEnd, this.onTransitionEnd)
	}

	/**
	 * Animate out the canvas
	 * 
	 * @function showSideNav
	 * @return void
	 */
	hideSideNav = () => {
		const {
			buttonActiveClass,
			canvasActiveClass,
			canvasAnimatingClass,
			lock
		} = this.options
		if (lock) this.lock.release()
		this.trigger('before:close')
		this.$button.classList.remove(buttonActiveClass)
		this.$canvas.classList.add(canvasAnimatingClass)
		this.$canvas.classList.remove(canvasActiveClass)
		this.$canvas.addEventListener(transitionEnd, this.onTransitionEnd)
	}

	/**
	 * Transition end event
	 * 
	 * @function showSideNav
	 * @return void
	 */
	onTransitionEnd = () => {
		const { canvasAnimatingClass } = this.options
		this.isVisible = !this.isVisible
		this.trigger(this.isVisible ? 'after:open' : 'after:close')
		this.$canvas.classList.remove(canvasAnimatingClass)
		this.$canvas.removeEventListener(transitionEnd, this.onTransitionEnd)
	}

	/**
	 * Unbind events, remove classes, disable
	 * 
	 * @function destroy
	 * @return SideNav
	 */
	destroy = () => {
		if (!this.enabled) return this
		this.isVisible = false

		const {
			buttonActiveClass,
			canvasActiveClass,
			canvasAnimatingClass
		} = this.options
		this.enabled = false
		this.$button.classList.remove(buttonActiveClass)
		this.$canvas.classList.remove(canvasAnimatingClass)
		this.$canvas.classList.remove(canvasActiveClass)
		this.events.forEach(event => this.off(event))
		this.removeEvents()
		return this
	}

	/**
	 * Bind events, enable
	 * 
	 * @function destroy
	 * @return SideNav
	 */
	initialize = () => {
		if (this.enabled) return this

		this.enabled = true
		this.addEvents()
		return this
	}
}
