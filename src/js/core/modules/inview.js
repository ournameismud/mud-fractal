import * as R from 'ramda'

export const inview = R.curry((root, events, options) => {
	if (!events) return

	const opts = options ? options : {}
	const defaults = {
		rootMargin: '0px',
		threshold: 0,
		...opts
	}

	const destroy = () => observer.unobserve(root)

	const onIntersection = entry => {
		const item = R.head(entry)
		const { isIntersecting } = item
		const type = isIntersecting ? 'enter' : 'exit'
		if (events[type]) {
			events[type]({
				...item,
				destroy
			})
		}
	}

	const observer = new IntersectionObserver(onIntersection, defaults)

	observer.observe(root)

	return {
		destroy
	}
})

export const InviewMixin = superclass =>
	class extends superclass {
		init() {
			this.$$inview = inview(
				this.$el,
				this.viewport,
				this.registerObserverOptions || {}
			)

			if (super.init) super.init()

			return this
		}

		destroy() {
			// this.$$inview.destroy()
			if (super.destroy) super.destroy()
		}
	}
