import * as R from 'ramda'

export function inview(base = document, events = {}) {
	if (!events) return

	const defaultOptions = {
		rootMargin: '0px',
		threshold: 0
	}

	let isActive = false
	let observer

	const onIntersection = entries => {
		entries.forEach(item => {
			const { isIntersecting } = item
			const type = isIntersecting ? 'enter' : 'exit'
			if (events[type]) {
				const remove = events[type](item)

				if (remove) {
					observer.unobserve(item.target)
				}
			}
		})
	}

	function watch({ selector, options = defaultOptions }) {
		if (window.IntersectionObserver) {
			isActive = true
			observer = new IntersectionObserver(onIntersection, options)
			const nodes =
				typeof selector === 'string'
					? [...base.querySelectorAll(selector)]
					: selector

			R.forEach(item => {
				observer.observe(item)
			})(nodes)
		}
	}

	function destroy() {
		if (observer && isActive && window.IntersectionObserver) {
			observer.disconnect()
			isActive = false
		}
	}

	return {
		destroy,
		watch
	}
}

/**
 * Create a router
 * @memberof Behaviour
 * @mixin InviewMixin
 * @description class used to manage elements entering/exiting the viewport
 * @example
 * import InviewMixin, { mix } from '@/core/ScreenMixin'
 * import {
 * 	RefsMixin,
 * } from '@/core/modules/'
 *
 * export default class ExampleWithAllTheThings extends mix(Behaviour).with(
 * 	InviewMixin
 * ) {
 * 	mount = () => {
 * 		this.$$inview.watch({
 * 			selector: '[data-element]'
 * 		})
 * 	}
 *
 * 	viewport = {
 *		enter: node => {
 *			log('exit', node)
 *		},
 *
 *		exit: node => {
 *			log('exit', node)
 *		}
 *	}
 * }
 * @return {InviewMixin}
 */
export const InviewMixin = superclass =>
	class extends superclass {
		init() {
			const events = this.viewport
			const base = this.$el
			this.$$inview = inview(base, events)

			if (super.init) super.init()

			return this
		}

		destroy() {
			this.$$inview.destroy()
			if (super.destroy) super.destroy()
		}
	}
