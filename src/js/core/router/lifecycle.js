import { findRoute } from '@/core/router/utils'
import baseTransition from '@/core/router/transition'
import fetch from '@/core/router/fetch'
import cache from '@/core/router/cache'
import historyManager from '@/core/router/history'
import eventBus from '@/core/modules/eventBus'
import domify from 'domify'

const lifecycle = (() => {
	let matchRoute
	let exitTransition = {}
	let enterTransition = {}
	let wrapper

	return {
		addRoutes(routes) {
			matchRoute = findRoute(routes)
			historyManager.store.from = matchRoute(window.location.pathname)

			return this
		},

		setWrapper(node) {
			wrapper = node

			return this
		},

		onLoad(pathname) {
			const newState = matchRoute(pathname)

			const fn = Object.assign({}, baseTransition, newState.route.view)

			fn.onLoad()

			eventBus.emit('route:transition:load', newState)

			return this
		},

		exit({ pathname, action, transition: trans, dataAttrs }) {
			const newState = matchRoute(pathname)
			const view = trans ? trans : newState.route.view
			historyManager.store.to = newState

			exitTransition = Object.assign(
				{},
				baseTransition,
				historyManager.store.from.route.view
			)
			enterTransition = Object.assign({}, baseTransition, view)

			const exitProps = {
				...historyManager.store,
				wrapper,
				oldHtml: document.querySelector(exitTransition.el),
				action,
				dataAttrs
			}

			const promise = (method, transition, props = {}) =>
				new Promise((resolve, reject) => {
					transition[method]({
						next: resolve,
						onError: reject,
						...props
					})
				})

			eventBus.emit('route:transition:exit', exitProps)

			return Promise.all([
				promise('onExit', exitTransition, exitProps),
				fetch(pathname)
			])
				.then(([, resp]) => {
					eventBus.emit('route:transition:resolved', exitProps)
					const { data: markup } = cache.get(pathname)

					if (resp.data && resp.data.data === false) {
						exitTransition.onError({ ...exitProps, ...resp })
						// window.location.pathname = pathname
						return false
					}

					const html = domify(markup)

					const title = html.querySelector('title').textContent.trim()
					const newHtml = html.querySelector(enterTransition.el)

					const props = {
						oldHtml: document.querySelector(exitTransition.el),
						wrapper,
						newHtml,
						title,
						html,
						...historyManager.store,
						action
					}
					eventBus.emit('route:before:dom:update', props)

					enterTransition.updateDom(props)

					eventBus.emit('route:after:dom:update', props)

					exitTransition.onAfterExit(props)

					return props
				})
				.then(props => {
					if (props) {
						const enterProps = {
							...props,
							...historyManager.store,
							action
						}

						if (action === 'PUSH') {
							log('update history ')
						}

						eventBus.emit('route:transition:enter', enterProps)

						promise('onEnter', enterTransition, enterProps).then(() => {
							enterTransition.onAfterEnter(enterProps)
							historyManager.store.from = newState
							eventBus.emit('route:transition:complete', enterProps)
						})
					}

					return props
				})
		}
	}
})()

export default lifecycle
