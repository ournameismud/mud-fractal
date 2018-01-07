export default class SponLax {
	defaults = {
		rootMargin: '0px',
		threshold: 0,
		shouldUnObserve: () => false,
		inview({ $node }) {
			const { top } = $node.getBoundingClientRect()
			const { speed } = $node.dataset
			$node.style.transform = `translate3d(0, ${top * parseFloat(speed)}px, 0)`
		}
	}

	prevFrame = -1

	constructor(selector = '[data-inview]', options = {}) {
		this.nodes = [...document.querySelectorAll(selector)].map((node, index) => {
			node.setAttribute('data-key', index)
			return node
		})

		this.options = { ...this.defaults, ...options }

		const { rootMargin, threshold } = this.options
		const observer = new IntersectionObserver(this.onIntersection(), {
			rootMargin,
			threshold
		})

		this.nodes.forEach($node => observer.observe($node))

		this.blobs = new Set()
		this.handle = null
	}

	within = node => node.getAttribute('data-inview') === 'true'

	markAsWithin = node => node.setAttribute('data-inview', 'true')

	markAsNotWithin = node => node.setAttribute('data-inview', 'false')

	loop = () => {
		const { inview } = this.options

		// if (window.pageYOffset === this.prevFrame) {
		// 	this.handle = requestAnimationFrame(this.loop)
		// 	return
		// }

		this.prevFrame = window.pageYOffset
		;[...this.blobs].forEach(inview)
		this.handle = requestAnimationFrame(this.loop)
	}

	onIntersection = () => (entries, observer) => {
		const { shouldUnObserve } = this.options

		entries.forEach(entry => {
			const { target: $node, isIntersecting } = entry
			const { delay: d } = $node.dataset
			const delay = d ? parseFloat(d) * 100 : 0

			if (isIntersecting) {
				if (shouldUnObserve($node)) {
					observer.unobserve($node)
				}

				log(delay)

				this.blobs.add($node)

				!this.within($node) && this.markAsWithin($node)
			} else {
				this.within($node) && this.markAsNotWithin($node)

				this.blobs.delete($node)
			}
		})

		if (this.blobs.size > 0 && this.handle === null) {
			this.loop()
		}

		if (this.blobs.length === 0) {
			cancelAnimationFrame(this.handle)
			this.handle = null
		}
	}
}
