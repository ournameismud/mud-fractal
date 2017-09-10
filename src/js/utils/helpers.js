import { transitionEnd, DomCss } from './dom'
import once from 'lodash.once'

export const transitionSteps = (element, css) => {

	function onEnd(resolve) {
		resolve()
	}

	return new Promise((resolve) => {
		setTimeout(() => {
			element.addEventListener(transitionEnd, once(onEnd.bind(null, resolve)))
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


