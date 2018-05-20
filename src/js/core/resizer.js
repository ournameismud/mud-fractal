import eventBus from '@/core/eventBus'
import raf from 'raf'
import * as R from 'ramda'

let handle

const getStyle = () => window.getComputedStyle(document.body, ':after')
const query = R.compose(R.replace(/'|"/g, ''), item =>
	item.getPropertyValue('content')
)
const getCurrentMediaQuery = R.compose(query, getStyle)

let last = getCurrentMediaQuery()

const getWindowProps = () => {
	const width = window.innerWidth
	const height = window.innerHeight
	const query = getCurrentMediaQuery()

	return {
		width,
		height,
		query
	}
}

const windowResizeEvent = e => {
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

const windowResize = () => {
	if (windowResize.isRunning) return
	windowResize.isRunning = true
	handle = raf.bind(null, windowResizeEvent)

	window.addEventListener('resize', handle, false)

	return {
		destroy() {
			if (!windowResize.isRunning) return
			windowResize.isRunning = false
			window.removeEventListener('resize', handle, false)
			handle.cancel()
		}
	}
}
windowResize.isRunning = false

const windowMatch = breakpoint => window.matchMedia(breakpoint).matches

const resizer = (events = {}) => {
	windowResize()

	let bank = []

	Object.entries(events).map(([breakpoint, fn]) => {
		const once = (arg, fn) => {
			if (once.value === arg) return
			fn({ match: arg, ...getWindowProps() })
			once.value = arg
		}

		const test = (breakpoint, fn) => {
			const state = windowMatch(breakpoint)
			once(state, fn)
		}

		const funk = test.bind(null, breakpoint, fn)
		bank.push(funk)
		windowMatch(breakpoint) && funk()
		eventBus.on('window:resize', funk)
	})

	const destroy = () => {
		bank.forEach(fn => eventBus.off('window:resize', fn))
		bank = []
	}

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

		destroy,

		...eventBus
	}
}

export default resizer
