import once from 'lodash.once'

const testElement = document.createElement('div')

const prefix = (function() {
	const styles = window.getComputedStyle(document.documentElement, '')
	const pre = (Array.prototype.slice
		.call(styles)
		.join('')
		.match(/-(moz|webkit|ms)-/) ||
		(styles.OLink === '' && ['', 'o']))[1]
	const dom = 'WebKit|Moz|MS|O'.match(new RegExp('(' + pre + ')', 'i'))[1]
	return {
		dom: dom,
		lowercase: pre,
		css: '-' + pre + '-',
		js: pre[0].toUpperCase() + pre.substr(1)
	}
})()

export const transitionEnd = (function() {
	const transEndEventNames = {
		WebkitTransition: 'webkitTransitionEnd',
		MozTransition: 'transitionend',
		OTransition: 'oTransitionEnd otransitionend',
		transition: 'transitionend'
	}
	for (let name in transEndEventNames) {
		if (testElement.style[name] !== undefined) {
			return transEndEventNames[name]
		}
	}
	return false
})()

/**
 * Return the prefix css3 property
 * @param {prop} prop - the un prefix css property (camelCase)
 * @return {String} the css3 property
 */
export function css3(prop) {
	function capitalize(str) {
		return str.charAt(0).toUpperCase() + str.slice(1)
	}
	const prefixed = prefix.css + capitalize(prop)
	const test = [prop, prefixed]
	for (let i = 0; i < test.length; i += 1) {
		if (testElement && testElement.style[test[i]] !== undefined) {
			return test[i]
		}
	}
	return false
}

export const transitionSteps = (element, mutation) => {
	function onEnd(resolve) {
		resolve()
	}

	return new Promise(resolve => {
		setTimeout(() => {
			element.addEventListener(transitionEnd, once(onEnd.bind(null, resolve)))
			mutation()
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
	} catch (err) {
		console.error(err)
	}

	return output
}

/**
 * Test against userAgent string, pretty cheap and can't really be trusted
 * @return {Boolean}
 */
export const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
	navigator.userAgent
)

export function slugify(text = '') {
	return text
		.toString()
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, '') // remove non-word [a-z0-9_], non-whitespace, non-hyphen characters
		.replace(/[\s_-]+/g, '_') // swap any length of whitespace, underscore, hyphen characters with a single _
		.replace(/^-+|-+$/g, '') // remove leading, trailing -
}
