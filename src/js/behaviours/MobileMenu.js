import SideNav from '@/ui/SideNav'
import Behaviour from '@/core'
import Viewport from '@/utils/viewport'
import {
	DomClass
} from '@/utils/dom'
import {
	transitionSteps
} from '@/utils/helpers'
/**
 *
 * @extends Behaviour
 * @class MobileMenu
 */
export class MobileMenu extends Behaviour {
	/**
	 * @function constructor
	 * @param  {HTMLElement} el | the html element the behaviour is mounted on
	 * @return MobileMenu
	 */
	constructor(el) {
		super(el)

		this.nav = new SideNav(document.getElementById('menu-btn'), {
			canvas: document.getElementById('site-menu')
		})

		const vp = new Viewport(true)

		vp.at('(max-width: 61.25em)', this.enable, this.disable)

		this.current = undefined
		this.$closer = document.getElementById('menu-sub-nav-closer')

		this.nav.on('after:close', () => {
			this.closeSubNav()
		})

		this.isRunning = false
	}

	events = {
		'click [data-show-subnav]': 'onClickShow',
		'click [data-hide-subnav]': 'onClickHide'
	}

	/**
	 * Enable the mobile menu, bind click events
	 * 
	 * @function enable
	 * @return Void
	 */
	enable = () => {
		this.delegateEvents()
		this.nav.initialize()
	}

	/**
	 * Disable the mobile menu, remove click events
	 * 
	 * @function disable
	 * @return Void
	 */
	disable = () => {
		this.unDelegateEvents()
		this.nav.destroy()
	}

	/**
	 * On click reveal the sub menu
	 * 
	 * @function onClickShow
	 * @param {Object} event object 
	 * @param {HTMLElement} dom node clicked
	 * @return Void
	 */
	onClickShow = (event, element) => {
		event.preventDefault()

		if(this.isRunning) return
		this.isRunning = true

		this.current = element.nextElementSibling
		this.openSubNav()
	}

	/**
	 * Hide the sub menu
	 * 
	 * @function onClickHide
	 * @param {Object} event object 
	 * @return Void
	 */
	onClickHide = event => {
		event.preventDefault()

		if(this.isRunning) return
		this.isRunning = true

		this.closeSubNav()
	}

	/**
	 * Open sub menu method
	 * 
	 * @return Void
	 */
	openSubNav = () => {
		DomClass(this.current).add('is-visible')

		transitionSteps(this.current).then(() => {
			this.isRunning = false
			DomClass(this.$closer).add('is-visible')
		})
	}

	/**
	 * Close sub menu method
	 * 
	 * @return Void
	 */
	closeSubNav = () => {
		DomClass(this.$closer).remove('is-visible')

		transitionSteps(this.$closer).then(() => {
			this.isRunning = false
			DomClass(this.current).remove('is-visible')
			log('a', this.isRunning)
		})
	}
}
