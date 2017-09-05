import Concert from 'concert'

const isFunc = (fn) => typeof fn === 'function'

export default class Viewport extends Concert {
	constructor(watch = false) {
		super()

		window.addEventListener('load', this.checkBreakpoint)
		watch && this.watch()
	}

	style = window.getComputedStyle(document.body, ':before')

	last = undefined

	matches = undefined

	change = undefined

	get width() {
		return window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth
	}

	get height() {
		return window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight
	}

	getCurrentBreakpoint = () => this.style.getPropertyValue('content').replace(/'|"/g, '')

	checkBreakpoint = () => {
		const current = this.getCurrentBreakpoint()
		if(current !== this.last) {
			this.trigger('change', current)
			this.last = current
		}
	}

	watch = () => {
		window.addEventListener('resize', this.dispatch, false)
	}
	
	dispatch = () => {
		requestAnimationFrame(() => {
			this.trigger('resize')
			if(this.last !== this.getCurrentBreakpoint()) {
				this.checkBreakpoint()
			}
		})
	}

	match = (breakpoint, success, reject) => {
		this.matches = window.matchMedia(breakpoint).matches
		if(this.matches && isFunc(success) && this.change !== 'success') {
			this.change = 'success'
			success()
		}

		if(!this.matches && isFunc(reject) && this.change !== 'reject') {
			this.change = 'reject'
			reject()
		}
	}

	at = (breakpoint, success, reject) => {
		this.match(breakpoint, success, reject)
		this.on('resize', () => this.match(breakpoint, success, reject))
	}

	destroy() {
		window.removeEventListener('resize', this.dispatch)
	}
}