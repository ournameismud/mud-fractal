import eventBus from '@/core/modules/eventBus'
import raf from 'raf'
import * as R from 'ramda'

/**
 * @namespace resizer
 */

export const resizer = (function() {
	// get the :after style from the body
	const getStyle = () => window.getComputedStyle(document.body, ':after')

	// get the content prop and give it a clean
	const query = R.compose(
		R.replace(/'|"/g, ''),
		item => item.getPropertyValue('content')
	)

	// compose the functions together to return the current breakpoint
	const getCurrentMediaQuery = R.compose(
		query,
		getStyle
	)

	const windowMatch = breakpoint => window.matchMedia(breakpoint).matches

	/**
	 * @memberof resizer
	 * @function getWindowProps
	 * @return {Object} with the current width/height/breakpoint
	 */
	function getWindowProps() {
		const width = window.innerWidth
		const height = window.innerHeight
		const query = getCurrentMediaQuery()

		return {
			width,
			height,
			query
		}
	}

	/**
	 * @memberof resizer
	 * @function mapEventsToResize
	 * @param {Array} events - array of functions to test/trigger
	 * @return {Object} with the current width/height/breakpoint
	 */
	function mapEventsToResize(events) {
		return R.compose(
			R.map(([breakpoint, fn]) => {
				// <REFACTOR></REFACTOR> me thinks this could be written in
				// a way that it can be defined outside of the loop
				const once = (arg, fn) => {
					if (once.value === arg) return
					fn({ match: arg, ...getWindowProps() })
					once.value = arg
				}

				// <REFACTOR></REFACTOR> me thinks this could be written in
				// a way that it can be defined outside of the loop
				const test = (breakpoint, fn) => {
					const state = windowMatch(breakpoint)
					once(state, fn)
				}

				const matchQueryTest = test.bind(null, breakpoint, fn)
				// if (windowMatch(breakpoint)) matchQueryTest()
				eventBus.on('window:resize', matchQueryTest)

				return matchQueryTest
			}),
			Object.entries
		)(events)
	}

	// setup a handle reference
	let handle

	// reference the current, will become to previous one
	let last = getCurrentMediaQuery()

	/**
	 * @description The throttled window resize event
	 * @memberof resizer
	 * @function windowResizeEvent
	 *
	 * @return {void}
	 */
	function windowResizeEvent() {
		const { width, height, query } = getWindowProps()

		eventBus.emit('window:resize', {
			width,
			height,
			query
		})

		if (query !== last) {
			last = query
			eventBus.emit('window:breakpoint', {
				width,
				height,
				query
			})
		}
	}

	/**
	 * @description add the window event - return a destroy method
	 * @memberof resizer
	 * @function addWindowResizeEvent
	 *
	 * @return {Object}
	 */
	function addWindowResizeEvent() {
		if (addWindowResizeEvent.isRunning) return
		addWindowResizeEvent.isRunning = true
		handle = raf(windowResizeEvent)

		window.addEventListener('resize', handle, false)

		return {
			destroy() {
				if (!addWindowResizeEvent.isRunning) return
				addWindowResizeEvent.isRunning = false
				window.removeEventListener('resize', handle, false)
				handle.cancel()
			}
		}
	}

	addWindowResizeEvent.isRunning = false

	return (events = {}) => {
		addWindowResizeEvent()

		// store the current events
		let bank = mapEventsToResize(events)

		return {
			get breakpoint() {
				return getCurrentMediaQuery()
			},

			get width() {
				return window.innerWidth
			},

			get height() {
				return window.innerHeight
			},

			destroy() {
				bank.forEach(fn => eventBus.off('window:resize', fn))
				bank = []
			},

			...eventBus
		}
	}
})()

/**
 * Create a router
 * @memberof Behaviour
 * @mixin ScreenMixin
 * @description class used to handle window resize events
 * @example
 * import ScreenMixin, { mix } from '@/core/ScreenMixin'
 * import {
 * 	ScreenMixin,
 * } from '@/core/modules/'
 *
 * export default class ExampleWithAllTheThings extends mix(Behaviour).with(
 * 	ScreenMixin
 * ) {
 * 	mount = () => {
 * 		this.$$screen.on('window:resize', () => {})
 * 	}
 *
 *	screens = {
 *		'(min-width: 1024px)': ({ match, ...rest }) => {
 *			if (match) {
 *				log(rest)
 *			}
 *		}
 *	}
 * }
 * @return {RefsMixin}
 */
export const ScreenMixin = superclass =>
	class extends superclass {
		init() {
			this.$$screen = resizer(this.screens)
			if (super.init) super.init()
			return this
		}

		destroy() {
			this.$$screen.destroy()
			if (super.destroy) super.destroy()
		}
	}
