import Wallop from 'wallop'
import { mergeOptions, slugify } from '@/utils/helpers'
import { DomClass } from '@/utils/dom'
import Delegate from 'dom-delegate'
import fromTo from 'mud-from-to'

/**
 * 
 * @class tabs
 * @extends  Wallop
 * @param  {HTMLElement} el : the form to validate
 * @param  {Object} options : tabs options, Standard Wallop options plus some extra
 * 									pagerWrapper: String // html string used to contain the pager elements
 * 									pagerItem: String // html string used to for each pager button
 * 									pagerActiveClass: String // class applied to the current pager
 * 									name: String // name used for accessibility props
 * 									delay: Number // when using loop this is the time between transitions
 * 									swipe: Boolean // add gestures
 * 									init: Boolean // initalize the tabs
 * 									pager: Boolean // adds pager html
 */
export default class Tabs extends Wallop {
	/**
	 * 
	 * @function constructor
	 * @param  {HTMLElement} el : the form to validate
	 * @param  {Object} options : tabs options
	 * @return tabs
	 */
	constructor(element, options) {
		const defaults = {
			buttonPreviousClass: 'c-tabs__prev',
			buttonNextClass: 'c-tabs__next',
			itemClass: 'c-tabs__item',
			currentItemClass: 'c-tabs__item--current',
			showPreviousClass: 'c-tabs__item--showPrevious',
			showNextClass: 'c-tabs__item--showNext',
			hidePreviousClass: 'c-tabs__item--hidePrevious',
			hideNextClass: 'c-tabs__item--hideNext',
			carousel: true,
			pagerActiveClass: 'is-current',
			selector: '[data-tab-pager]',
			animate: true,
			init: true
		}

		const opts = mergeOptions(defaults, options, element, 'tabsOptions')
		const pattern = pathToRegexp('/:foo/:bar')

		super(element, opts)

		this.delegate = new Delegate(element)
		this.options = opts
		this.$el = element
		this.$tabs = [...element.querySelectorAll(`.${opts.itemClass}`)]
		this.previousIndex = this.currentItemIndex
		opts.init && this.initialize()
		this.hashes = []
		this.page = pattern.exec(window.location.pathname)
	}

	/**
		 * Bind event listeners
		 *
		 * @function addEvents
		 * @return {Tabs}
		 */
	addEvents = () => {
		const { selector } = this.options
		this.delegate.on('click', selector, this.clickHandle)

		return this
	}

	/**
		 * Initialize all the things
		 *
		 * @function initialize
		 * @return {Tabs}
		 */
	initialize = () => {
		this.setupPanels()
		this.addEvents()
		const { hash } = window.location

		if (hash) {
			const tab = this.getTab(hash.split('#')[1])
			tab && this.goTo(tab.index)
		}

		this.listen()

		return this
	}

	/**
		 * Listen to tab changes
		 * @function listen
		 * @return void
		 */
	listen() {
		this.on('change', this.onChange)
	}

	setupPanels = () => {
		this.tabs = this.$tabs.map(($tab, index) => {
			const id = $tab.getAttribute('id')
			const { tabTitle } = $tab.dataset
			const $btn = this.$el.querySelector(`[href="#${id}"]`)

			log(slugify(tabTitle))

			return {
				$tab,
				$btn,
				id,
				index,
				title: slugify(tabTitle),
				hash: `#${id}`
			}
		})
	}

	clickHandle = (e, elm) => {
		e.preventDefault()
		const { index, title } = this.tabs.find(
			({ hash }) => elm.getAttribute('href') === hash
		)
		window.history.pushState({}, '', title)
		this.goTo(index)
	}

	getTab = hash => {
		return this.tabs.find(({ title }) => title === hash)
	}

	/**
		 * Listen to slide changes
		 * @function onChange
		 * @param {Object} details - deconstructed param
		 * @return void
		 */
	onChange = ({ detail }) => {
		const { currentItemIndex } = detail

		this.updatePagerLinks(this.previousIndex, currentItemIndex)
		this.previousIndex = currentItemIndex
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
		const $prev = this.tabs[prev].$btn
		const $next = this.tabs[next].$btn

		DomClass($prev).remove(pagerActiveClass)
		DomClass($next).add(pagerActiveClass)
	}
}
