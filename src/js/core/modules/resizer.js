import eventBus from '@/core/modules/eventBus'
import raf from 'raf'
import * as R from 'ramda'
/***
 *
 * Wrapper/Helper window resize event
 *
 * @function resizer
 *
 * @return :function resizer
 */

export const resizer = (function() {
	// get the :after style from the body
	const getStyle = () => window.getComputedStyle(document.body, ':after')

	// get the content prop and give it a clean
	const query = R.compose(R.replace(/'|"/g, ''), item =>
		item.getPropertyValue('content')
	)

	// compose the functions together to return the current breakpoint
	const getCurrentMediaQuery = R.compose(query, getStyle)

	const windowMatch = breakpoint => window.matchMedia(breakpoint).matches

	/**
	 *
	 * @function getWindowProps
	 *
	 * @return :object with the current width/height/breakpoint
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
	 *
	 * consumes an object like this:
	 *
	 *  {
	 *	'(min-width: 960px)': () => {},
	 *	'(min-width: 680px)': () => {}
	 *	}
	 *
	 * @function mapEventsToResize
	 *
	 * @param :object
	 *
	 * @return :array of functions
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
				windowMatch(breakpoint) && matchQueryTest()
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
	 * The throttled window resize event
	 * @private
	 * @function windowResizeEvent
	 *
	 * @return void
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
	 * add the window resize event
	 *
	 * returns the destroy method
	 *
	 * @function addWindowResizeEvent
	 *
	 * @return object
	 */
	function addWindowResizeEvent() {
		if (addWindowResizeEvent.isRunning) return
		addWindowResizeEvent.isRunning = true
		handle = raf.bind(null, windowResizeEvent)

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
