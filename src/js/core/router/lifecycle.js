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

		exit(pathname, trans) {
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
					transition[method]({ next: resolve, ...historyManager.store })
				})

			return Promise.all([promise('onExit', exitTransition), fetch(pathname)])
				.then(() => {
					const { data: markup } = cache.get(pathname)

					eventBus.emit('route:exit:complete')

					const html = domify(markup)

					const title = html.querySelector('title').textContent
					const newHtml = html.querySelector(enterTransition.el)

					const props = {
						wrapper: document.getElementById('page-wrapper'),
						newHtml,
						title
					}
					enterTransition.updateDom({ ...props, ...historyManager.store })
					exitTransition.onAfterExit({ ...props, ...historyManager.store })

					return props
				})
				.then(props => {
					eventBus.emit('route:enter')

					promise('onEnter', enterTransition).then(() => {
						enterTransition.onAfterEnter({ ...props, ...historyManager.store })
						historyManager.store.from = newState
						eventBus.emit('route:enter:complete')
					})
				})
		}
	}
})()

export default lifecycle
