import Listener from './listener'
import { Dispatcher, Prefetch, Pjax, HistoryManager, BaseTransition } from 'barba.js'
import pathToRegexp from 'path-to-regexp'
import { transitions } from '@/views'

const transition = BaseTransition.extend({
	start: function () {
		log('start trans', this)
		this.newContainerLoading.then(() => this.done())
	},

	done: function () {
		log('end trans')
		this.oldContainer.parentNode.removeChild(this.oldContainer)
		this.newContainer.style.visibility = 'visible'
		this.deferred.resolve()
	}
})

export default class RouteManager {
	constructor(routes) {
		this.routes = routes
		this.listener = new Listener()
		this.clicked = false
	}

	get container() {
		return document.querySelector(`.${Pjax.Dom.containerClass}`)
	}

	getRouterObject(path) {
		const pattern = pathToRegexp('/:foo/:bar?')
		return pattern.exec(path.split('.')[0])
	}

	currentRoute() {
		return {
			path: this.getRouterObject(window.location.pathname),
			namespace: Pjax.Dom.getNamespace(this.container)
		}
	}

	getRoute(href) {
		return {
			path: this.getRouterObject(href),
			namespace: null
		}
	}


	mount(loader) {
		const _this = this

		Pjax.getTransition = function () {
			const { from } = HistoryManager.routes
			let props = {}
			let path = '/'

			if(from.path) {
				path = from.path['input']
			}

			if(from.namespace) {
				props = transitions.find((entry) => entry.namespace === from.namespace).transition
			} else {
				if(transitions.find((entry) => entry.path === path)) {
					props = transitions.find((entry) => entry.path === path).transition
				}
			}
			
			return transition.extend({
				...props,
				...HistoryManager.routes,
				loader
			})
		}

		Dispatcher.on('linkClicked', (HTMLElement) => {
			this.clicked = true
			const { pathname } = HTMLElement

			HistoryManager.routes = {
				from: {
					path: _this.getRouterObject(window.location.pathname),
					namespace: Pjax.Dom.getNamespace(this.container)
				},
				to: _this.getRoute(pathname)
			}

		})

		Dispatcher.on('initStateChange', (/*currentStatus*/) => {})

		Dispatcher.on('newPageReady', (x, y, HTMLElementContainer) => {
			if(this.clicked) {
				loader.unmount().update(HTMLElementContainer, false)
			}
		})

		Dispatcher.on('transitionCompleted', (/*currentStatus, prevStatus*/) => {
			if(this.clicked) {
				log('transitionCompleted')
			}
		})

		Pjax.Dom.containerClass = 'barba-container'
		Pjax.Dom.wrapperId = 'barba-wrapper'

		Prefetch.init()
		Pjax.start()
	}
}
