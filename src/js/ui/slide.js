import Wallop from 'wallop'
import Hammer from 'hammerjs'
import domify from 'domify'
import { mergeOptions } from '@/utils/helpers'
import { DomClass } from '@/utils/dom'
/**
 * 
 * @class Slide
 * @extends  Wallop
 * @param  {HTMLElement} el : the form to validate
 * @param  {Object} options : Slide options, Standard Wallop options plus some extra
 * 									pagerWrapper: String // html string used to contain the pager elements
 * 									pagerItem: String // html string used to for each pager button
 * 									pagerActiveClass: String // class applied to the current pager
 * 									name: String // name used for accessibility props
 * 									delay: Number // when using loop this is the time between transitions
 * 									swipe: Boolean // add gestures
 * 									init: Boolean // initalize the slide
 * 									pager: Boolean // adds pager html
 */
export default class Slide extends Wallop {
	/**
	 * 
	 * @function constructor
	 * @param  {HTMLElement} el : the form to validate
	 * @param  {Object} options : Slide options
	 * @return Slide
	 */
	constructor(element, options) {
		const defaults = {
			buttonPreviousClass: 'c-slide__prev',
			buttonNextClass: 'c-slide__next',
			itemClass: 'c-slide__item',
			currentItemClass: 'c-slide__item--current',
			showPreviousClass: 'c-slide__item--showPrevious',
			showNextClass: 'c-slide__item--showNext',
			hidePreviousClass: 'c-slide__item--hidePrevious',
			hideNextClass: 'c-slide__item--hideNext',
			carousel: true,
			pagerWrapper: '<ul class="c-slide__pager"></ul>',
			pagerItem: '<li class="c-slide__pager-item"></li>',
			pagerActiveClass: 'is-current',
			delay: 3000,
			swipe: true,
			init: true,
			pager: true,
			loop: false
		}

		const opts = mergeOptions(defaults, options, element, 'slideOptions')

		super(element, opts)
		this.options = opts
		this.$tag = element
		this.slides = [...element.querySelectorAll(`.${opts.itemClass}`)]
		this.previousIndex = this.currentItemIndex

		opts.init && this.initialize()
	}

	/**
	 * 
	 * @function initialize
	 * @return Slide
	 */
	initialize = () => {
		this.goTo(this.previousIndex)

		if (this.options.pager) {
			this.renderPager()
		}

		if (this.options.loop) {
			this.loop()
		}

		if (this.options.swipe) {
			this.addGestures()
		}

		this.listen()

		return this
	}

	/**
	 * 
	 * @function renderPager
	 * @return Slide
	 */
	renderPager = () => {
		const { pagerWrapper, pagerItem, pagerActiveClass } = this.options
		this.$pagerWrapper = this.$tag.appendChild(domify(pagerWrapper))
		this.$pagerWrapper.appendChild(
			domify(this.slides.map(() => pagerItem).join(''))
		)
		this.$buttons = [...this.$pagerWrapper.children].map(($button, index) => {
			$button.setAttribute('data-index', index)
			if (index === this.currentItemIndex) {
				DomClass($button).add('is-current')
			}
			return $button
		})

		DomClass(this.$buttons[this.currentItemIndex]).add(pagerActiveClass)

		this.addPagerEvents()

		return this
	}

	/**
	 * Bind pager events
	 * @function addPagerEvents
	 * @return Slide
	 */
	addPagerEvents = () => {
		this.$buttons.forEach(button =>
			button.addEventListener('click', this.onPagerClick)
		)
	}

	/**
	 * Remove pager events
	 * @function removePagerEvents
	 * @return Slide
	 */
	removePagerEvents = () => {
		this.$buttons.forEach(button =>
			button.removeEventListener('click', this.onPagerClick)
		)
	}

	/**
	 * Pager click event
	 * @function onPagerClick
	 * @param {Object} evt 
	 * @return void
	 */
	onPagerClick = evt => {
		evt.preventDefault()
		const { currentTarget } = evt
		const { index } = currentTarget.dataset

		log(index)

		this.goTo(index)
	}

	/**
	 * Update the pager elements
	 * @function updatePagerLinks
	 * @param {Number} prev 
	 * @param {Number} next 
	 * @return void
	 */
	updatePagerLinks = (prev, next) => {
		const { pagerActiveClass } = this.options

		DomClass(this.$buttons[prev]).remove(pagerActiveClass)
		DomClass(this.$buttons[next]).add(pagerActiveClass)
	}

	/**
	 * Listen to slide changes
	 * @function listen
	 * @return void
	 */
	listen() {
		this.on('change', this.onChange)
	}

	/**
	 * Listen to slide changes
	 * @function onChange
	 * @param {Object} details - deconstructed param
	 * @return void
	 */
	onChange = ({ detail }) => {
		const { currentItemIndex } = detail

		if (this.options.pager) {
			this.updatePagerLinks(this.previousIndex, currentItemIndex)
		}

		if (this.options.loop) {
			this.cancelLoop()
			this.loop()
		}

		this.previousIndex = currentItemIndex
	}

	/**
	 * Destroy the things
	 * @function destroy
	 * @return Slide
	 */
	destroy() {
		this.removeAllHelperSettings()
		this.off('change', this.onChange)

		if (this.buttonPrevious) {
			this.buttonPrevious.setAttribute('disabled', true)
		}

		if (this.buttonNext) {
			this.buttonNext.setAttribute('disabled', true)
		}

		if (this.options.pager) {
			this.removePagerEvents()
			this.$pagerWrapper.parentNode.removeChild(this.$pagerWrapper)
		}

		if (this.options.loop) {
			this.cancelLoop()
		}

		if (this.options.swipe) {
			this.mc.destroy()
		}

		return this
	}

	/**
	 * loop through the slides
	 * @function loop
	 * @return void
	 */
	loop = () => {
		this.timeout = setTimeout(() => {
			this.handle = requestAnimationFrame(this.loop)
			this.next()
		}, this.options.delay)
	}

	/**
	 * cancel looping
	 * @function cancelLoop
	 * @return void
	 */
	cancelLoop = () => {
		cancelAnimationFrame(this.handle)
		clearTimeout(this.timeout)
	}

	/**
	 * add gestures 
	 * @function addGestures
	 * @return void
	 */
	addGestures = () => {
		this.mc = new Hammer.Manager(this.$tag, {
			recognizers: [
				[
					Hammer.Pan,
					{
						direction: Hammer.DIRECTION_HORIZONTAL
					}
				]
			]
		})
		this.mc.add(new Hammer.Pan())
		this.mc.on('panend', this.onPanEnd)
	}

	/**
	 * the gesture event
	 * @function onPanEnd
	 * @param {String} deconstructed event object
	 * @return void
	 */
	onPanEnd = ({ additionalEvent }) => {
		if (additionalEvent === 'panleft') {
			this.previous()
		} else if (additionalEvent === 'panright') {
			this.next()
		}
	}
}
