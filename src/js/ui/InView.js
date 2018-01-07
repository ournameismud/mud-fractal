import Concert from 'concert'

export default class InView extends Concert {
	defaults = {
		rootMargin: '0px',
		threshold: 0
	}

	constructor(selector = '[data-inview]', options = {}) {
		super()
		this.nodes = [...document.querySelectorAll(selector)]

		this.options = { ...this.defaults, ...options }

		const { rootMargin, threshold } = this.options
		const observer = new IntersectionObserver(this.onIntersection(), {
			rootMargin,
			threshold
		})

		this.nodes.forEach($node => observer.observe($node))
	}

	within = node => node.getAttribute('data-inview') === 'true'

	markAsWithin = node => node.setAttribute('data-inview', 'true')

	onIntersection = () => (entries, observer) => {
		entries.forEach(entry => {
			const { target: $node, intersectionRatio } = entry
			if (intersectionRatio > 0) {
				observer.unobserve($node)
				if (!this.within($node)) {
					this.entrance($node)
					this.markAsWithin($node)
				}
			}
		})
	}

	entrance = $node => {
		const { inviewAnimation: animation } = $node.dataset
		this.trigger('node:entrance', { $node, animation })
	}
}
