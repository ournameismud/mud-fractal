import {
	flattenRoutes,
	findRoute,
	navLinks,
	parseUrl
} from './utils/router.utils'
import Barba from 'barba.js'

const { Pjax, Dispatcher, BaseTransition, Prefetch } = Barba

export { Pjax, Dispatcher, BaseTransition, Prefetch }

import Events from '@/core/events'

export const Route = superclass =>
	class extends superclass {
		withRoutes() {
			Events.on('route:change', this.onChange)
			Events.on('route:ready', this.onReady)
			Events.on('route:complete', this.onComplete)

			this.startingRoute = parseUrl(window.location.href)
		}

		onChange = () => {}
		onReady = () => {}
		onComplete = () => {}
	}

export default class Router {
	constructor({
		routes,
		onChange = [],
		onReady = [],
		onComplete = [],
		navigation = ['body'],
		transitionOnLoad = true,
		currentClass,
		currentParentClass
	}) {
		this.routes = flattenRoutes(routes)
		this.findRoute = findRoute(this.routes)
		this.navLinks = navLinks(navigation, { currentClass, currentParentClass })

		this.playOnLoad = transitionOnLoad
		this.onChange = onChange
		this.onReady = onReady
		this.onComplete = onComplete
		this.$wrapper = Pjax.Dom.getWrapper()
	}

	syncEvents = () => {
		Dispatcher.on('linkClicked', this.routeRequest)
		Dispatcher.on('initStateChange', this.routeChange)
		Dispatcher.on('newPageReady', this.routeReady)
		Dispatcher.on('transitionCompleted', this.routeComplete)
	}

	linkClicked = true

	matchRoute = href => {
		this.history.previous = this.history.current
		this.history.current = this.findRoute(href)
	}

	history = {
		previous: null,
		current: null
	}

	routeRequest = el => {
		const { href } = el
		this.linkClicked = true
		this.matchRoute(href)
	}

	getData = () => {
		const { current: { data, route } } = this.history

		const from = this.history.previous
			? {
				...this.history.previous.data,
				name: this.history.previous.route.name
			}
			: null

		return { from, to: { ...data, name: route.name } }
	}

	routeChange = () => {
		if (!this.linkClicked) {
			this.matchRoute(window.location.href)
		}
		const { from, to } = this.getData()

		if (this.playOnLoad) {
			this.playOnLoad = false
			const { route: { view } } = this.history.current
			const container = Pjax.Dom.getContainer()

			new Promise(resolve => {
				view.onEnter({
					from: null,
					to,
					container,
					wrapper: this.$wrapper,
					next: resolve
				})
			}).then(() => {
				if (view.onEnterComplete) {
					view.onEnterComplete({
						from: null,
						to,
						container,
						wrapper: this.$wrapper
					})
				}
			})
		}

		Events.emit('route:change', { from, to })
		this.onChange.forEach(fn => fn({ from, to }))
	}

	routeReady = (
		currentStatus,
		prevStatus,
		HTMLElementContainer,
		newPageRawHTML
	) => {
		const { from, to } = this.getData()

		Events.emit('route:ready', {
			from,
			to,
			currentStatus,
			prevStatus,
			HTMLElementContainer,
			newPageRawHTML
		})

		this.onReady.forEach(fn =>
			fn({
				from,
				to,
				currentStatus,
				prevStatus,
				HTMLElementContainer,
				newPageRawHTML
			})
		)
	}

	routeComplete = () => {
		this.linkClicked = false

		const { from, to } = this.getData()

		this.navLinks(to.source)

		Events.emit('route:complete', { from, to })

		this.onComplete.forEach(fn =>
			fn({
				from,
				to
			})
		)
	}

	transitionManager = () => {
		const _this = this

		Pjax.getTransition = function() {
			return BaseTransition.extend({
				start() {
					Promise.all([this.newContainerLoading, this.pageExit()])
						.then(this.pageExitComplete.bind(this))
						.then(this.pageEnter.bind(this))
						.then(this.pageEnterComplete.bind(this))
				},

				pageExit() {
					return new Promise(resolve => {
						const { route: { view } } = _this.history.previous
						const { from, to } = _this.getData()

						view.onLeave({
							from,
							to,
							container: this.oldContainer,
							wrapper: _this.$wrapper,
							next: resolve
						})
					})
				},

				pageExitComplete() {
					const { route: { view } } = _this.history.previous

					this.oldContainer.parentNode.removeChild(this.oldContainer)

					if (view.onLeaveComplete) {
						const { from, to } = _this.getData()
						view.onLeaveComplete({
							from,
							to,
							container: this.newContainer,
							wrapper: _this.$wrapper
						})
					}
				},

				pageEnter() {
					return new Promise(resolve => {
						this.newContainer.style.visibility = 'visible'
						const { route: { view } } = _this.history.current
						const { from, to } = _this.getData()
						view.onEnter({
							from,
							to,
							container: this.newContainer,
							wrapper: _this.$wrapper,
							next: resolve
						})
					})
				},

				pageEnterComplete() {
					const { route: { view } } = _this.history.previous

					this.deferred.resolve()

					if (view.onEnterComplete) {
						const { from, to } = _this.getData()
						view.onEnterComplete({
							from,
							to,
							container: this.newContainer,
							wrapper: _this.$wrapper
						})
					}
				}
			})
		}
	}

	start = () => {
		this.history.current = this.findRoute(window.location.href)

		this.transitionManager()
		this.syncEvents()

		Pjax.start()
		Prefetch.init()
	}
}
