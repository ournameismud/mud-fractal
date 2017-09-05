import { transitionEnd, DomCss } from './dom'
import once from 'lodash.once'

export const transitionSteps = (element, css) => {

	function onEnd(element, resolve) {
		resolve()
	}

	return new Promise((resolve) => {
		setTimeout(() => {
			element.addEventListener(transitionEnd, once(onEnd.bind(null, element, resolve)))
			DomCss(element, css)
		})
	})
}


/**
 * Helper function to lock the screen in the current position and prevent scrolling
 *
 * @function lock
 * @return {Object}, capture/release methods
 */
export const lock = () => {
	const { style } = document.body
	let windowTop

	return {
		capture() {
			windowTop = window.pageYOffset
			style.position = 'fixed'
			style.height = '100%'
			style.width = '100%'
			style.overflow = 'hidden'
			style.top = `${windowTop * -1}px`
		},
		release() {
			style.position = ''
			style.height = ''
			style.width = ''
			style.overflow = ''
			style.top = ''
			window.scrollTo(0, windowTop)
		}
	}
}

export const getJson = (el, name) => {
	// try and merge any json options from the dom
	let output = []

	try {
		const json = el.dataset[name]
		output = typeof json === 'string' ? JSON.parse(json) : false
	} catch(err) {
		console.error(err)
	}

	return output
}

/**
 * Test against userAgent string, pretty cheap and can't really be trusted
 * @return {Boolean} 
 */
export const isMobile = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)


/**
 * Helper to merge default options with provided options, and options from a dom node
 * @return {Object/Array} 
 */
export const mergeOptions = (defaults, opts, el, name) => {
	// create options object, merge opts from params
	let options = {
		...defaults,
		...opts
	}
	// try and merge any json options from the dom
	try {
		const o = el.dataset[name]
		const json = typeof o === 'string' ? JSON.parse(o) : {}
		options = {
			...options,
			...json
		}
	} catch(err) {
		console.error(err)
	}
	return options
}


/**
	 * Animate $target from start to end
	 * @param {Object} options
	 * @param {Function} onTick - function to be called at each tick
	 * @return {Promise}
	 */
export function fromTo(options = {}, onTick) {
	const defaults = {
		easing: function defaultEasing(t, b, c, d) {
			if((t /= d / 2) < 1) return c / 2 * t * t + b
			return -c / 2 * ((--t) * (t - 2) - 1) + b // eslint-disable-line
		},
		duration: 1000
	}


	const { easing, duration, start, end } = {...defaults, ...options}
	const condition = (lastTick, next, end) => {
		return (start < end) ? (next < end && lastTick <= next) : (next > end && lastTick >= next)
	}

	let next = null
	let timeElapsed = null
	let timeStart = null
	let frame = null
	return new Promise((resolve) => { 
		const loop = (currentTime) => {
			let lastTick = next || start
			if(!timeStart) timeStart = currentTime
			timeElapsed = currentTime - timeStart

			next = Math.round(easing(timeElapsed, start, end - start, duration))
			if(condition(lastTick, next, end)) {
				frame = window.requestAnimationFrame(loop)
				onTick(next)
			} else {
				resolve()
				window.cancelAnimationFrame(frame)
				timeElapsed = null
				timeStart = null
				frame = null
				lastTick = null
			}
		}
		frame = window.requestAnimationFrame(loop)
	})
}


