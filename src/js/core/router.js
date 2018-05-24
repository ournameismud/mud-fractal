import createEvents from '@/core/modules/createEvents'
import eventBus from '@/core/modules/eventBus'
import createHistory from 'history/createBrowserHistory'
import domify from 'domify'
import {
	preventClick,
	flattenRoutes,
	findRoute
} from '@/core/utils/router.utils'

const history = createHistory()

const cache = {}

const delay = delay => new Promise(resolve => setTimeout(resolve, delay))

const baseView = {
	onExit: ({ next }) => {
		log('onExit')

		delay(100).then(next)
	},

	onAfterExit: () => {
		log('onAfterExit')
	},

	onEnter: ({ next }) => {
		log('onEnter')
		delay(100).then(next)
	},

	onAfterEnter: () => {
		log('onAfterEnter')
	}
}

export default class Router {
	constructor({ routes }) {
		this.$routes = flattenRoutes(routes)
		this.$findRoute = findRoute(this.$routes)
		this.updateHistory(window.location.pathname)

		this.$wrapper = document.getElementById('page-wrapper')

		this.$events = createEvents.call(this, document, {
			'click a': 'onClick',
			'mouseover a': 'onMouseEnter'
		})

		history.listen((location, action) => {
			const { pathname } = location
			// if the current path is not currently cached, and the action is POP
			// run
			if (!cache[pathname]) {
				if (action === 'POP') {
					this.updateHistory(pathname)
					this.lifecycle.exit(pathname).then(() => {
						this.inject({ ...cache[pathname] })
						return this.lifecycle.enter(pathname)
					})
				}
				return
			}

			const { state } = location

			eventBus.emit('history:change', {
				action,
				pathname,
				state
			})
		})
	}

	state = {
		current: '',
		previous: ''
	}

	currentPath = null

	onMouseEnter = (e, elm) => {
		const { pathname } = elm
		if (!preventClick(e, elm) || cache[pathname]) {
			return
		}

		log('mouse fetch request')
		this.fetch(pathname)
	}

	onClick = (e, elm) => {
		const { pathname } = elm

		if (!preventClick(e, elm)) {
			return
		}

		e.stopPropagation()
		e.preventDefault()

		if (pathname !== window.location.pathname) return

		this.updateHistory(pathname)

		this.lifecycle
			.exit(pathname)
			.then(() => {
				this.inject({ ...cache[pathname] })
				return this.lifecycle.enter(pathname)
			})
			.then(() => {
				history.push(pathname, { some: 'state' })
			})
	}

	lifecycle = {
		exit: pathname => {
			const x = new Promise(resolve => {
				baseView.onExit({ next: resolve })
			})
			return Promise.all([x, this.fetch(pathname)])
		},

		enter: () => {
			const x = new Promise(resolve => {
				baseView.onEnter(resolve)
			})
			return x.then(() => {
				log('all done')
			})
		}
	}

	updateHistory = pathname => {
		const route = this.$findRoute(pathname)
		this.currentPath = pathname
		this.state.previous = this.state.current
		this.state.current = route
	}

	fetch = pathname => {
		return new Promise(resolve => {
			if (cache[pathname]) {
				resolve()
				return
			}

			fetch(pathname)
				.then(response => response.text())
				.then(data => {
					const $html = domify(data)
					cache[pathname] = {
						html: $html.querySelector('.page-child'),
						title: $html.querySelector('title').textContent
					}
					resolve()
				})
		})
	}

	inject = ({ html, title }) => {
		this.$wrapper.innerHTML = ''
		this.$wrapper.appendChild(html)
		document.title = title
	}

	mount = () => {
		this.$events.attachAll()
	}
}
