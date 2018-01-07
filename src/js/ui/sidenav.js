import Concert from 'concert'
import { lock, transitionEnd } from '@/utils/helpers'

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
	constructor(options = {}) {
		super()
		this.$body = document.querySelector('body')
		this.$html = document.querySelector('html')
		this.options = { ...this.defaults, ...options }
		this.isVisible = false
		this.events = ['before:open', 'after:open', 'before:close', 'after:close']
		this.options.init && this.initialize()
		this.enabled = false
		this.open = false
		if (this.options.lock) this.lock = lock()
	}

	setOptions = o => {
		this.options = { ...this.options, ...o }

		return this
	}

	/**
	 * Bind Events
	 *
	 * @function addEvents
	 * @return SideNav
	 */
	addEvents = () => {
		const { clickOutside, inner, canvas, closer, button } = this.options
		if (clickOutside && inner) {
			canvas.addEventListener('click', this.hideSideNav)
			inner.addEventListener('click', this.blockClicks)
		}
		if (closer) closer.addEventListener('click', this.hideSideNav)
		button.addEventListener('click', this.onButtonClick)
		return this
	}

	/**
	 * Remove Events
	 *
	 * @function addEvents
	 * @return SideNav
	 */
	removeEvents = () => {
		const { clickOutside, inner, canvas, closer, button } = this.options
		if (clickOutside && inner) {
			canvas.removeEventListener('click', this.hideSideNav)
			inner.removeEventListener('click', this.blockClicks)
		}
		if (closer) closer.removeEventListener('click', this.hideSideNav)
		button.removeEventListener('click', this.onButtonClick)
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
	 * @return SideNav
	 */
	showSideNav = () => {
		if (this.open) return this
		this.open = true
		const {
			buttonActiveClass,
			canvasActiveClass,
			canvasAnimatingClass,
			lock,
			canvas,
			button
		} = this.options

		if (lock) this.lock.capture()

		this.trigger('before:open')
		button.classList.add(buttonActiveClass)
		canvas.classList.add(canvasAnimatingClass)
		canvas.classList.add(canvasActiveClass)
		canvas.addEventListener(transitionEnd, this.onTransitionEnd)

		return this
	}

	/**
	 * Animate out the canvas
	 *
	 * @function showSideNav
	 * @return SideNav
	 */
	hideSideNav = e => {
		if (!this.open) return this
		this.open = false

		if (e && e.preventDefault) e.preventDefault()
		const {
			buttonActiveClass,
			canvasActiveClass,
			canvasAnimatingClass,
			lock,
			canvas,
			button
		} = this.options
		if (lock) this.lock.release()
		this.trigger('before:close')
		button.classList.remove(buttonActiveClass)
		canvas.classList.add(canvasAnimatingClass)
		canvas.classList.remove(canvasActiveClass)
		canvas.addEventListener(transitionEnd, this.onTransitionEnd)

		return this
	}

	/**
	 * Transition end event
	 *
	 * @function showSideNav
	 * @return void
	 */
	onTransitionEnd = () => {
		const { canvasAnimatingClass, canvas } = this.options
		this.isVisible = !this.isVisible
		this.trigger(this.isVisible ? 'after:open' : 'after:close')
		canvas.classList.remove(canvasAnimatingClass)
		canvas.removeEventListener(transitionEnd, this.onTransitionEnd)
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
			canvasAnimatingClass,
			canvas,
			button
		} = this.options
		this.enabled = false
		button.classList.remove(buttonActiveClass)
		canvas.classList.remove(canvasAnimatingClass)
		canvas.classList.remove(canvasActiveClass)
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
		this.addEvents()
		return this
	}
}
