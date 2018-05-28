import { findRoute } from '@/core/router/utils'
import baseTransition from '@/core/router/transition'
import fetch from '@/core/router/fetch'
import cache from '@/core/router/cache'
import historyManager from '@/core/router/history'
import eventBus from '@/core/modules/eventBus'
import domify from 'domify'

const lifecycle = (() => {
	let matchRoute
	let exitTransition
	let enterTransition

	return {
		addRoutes(routes) {
			matchRoute = findRoute(routes)
			historyManager.store.from = matchRoute(window.location.pathname)
		},

		exit({ pathname, action, trans }) {
			const newState = matchRoute(pathname)
			const view = trans ? trans : newState.route.view
			historyManager.store.to = newState

			eventBus.emit('route:exit')

			exitTransition = Object.assign(
				{},
				baseTransition,
				historyManager.store.from.route.view
			)
			enterTransition = Object.assign({}, baseTransition, view)

			const promise = (method, transition) =>
				new Promise(resolve => {
					transition[method]({ next: resolve, ...historyManager.store, action })
				})

			return Promise.all([promise('onExit', exitTransition), fetch(pathname)])
				.then(() => {
					const { data: markup } = cache.get(pathname)

					const html = domify(markup)

					const title = html.querySelector('title').textContent
					const newHtml = html.querySelector(enterTransition.el)

					const props = {
						wrapper: document.getElementById('page-wrapper'),
						newHtml,
						title
					}
					eventBus.emit('route:before:dom:update')

					enterTransition.updateDom({
						...props,
						...historyManager.store,
						action
					})

					eventBus.emit('route:after:dom:update', { newHtml })

					exitTransition.onAfterExit({
						...props,
						...historyManager.store,
						action
					})

					return props
				})
				.then(props => {
					eventBus.emit('route:enter')

					promise('onEnter', enterTransition).then(() => {
						enterTransition.onAfterEnter({
							...props,
							...historyManager.store,
							action
						})
						historyManager.store.from = newState
						eventBus.emit('route:enter:complete')
					})
				})
		}
	}
})()

export default lifecycle
