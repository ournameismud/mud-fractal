import { findRoute } from '@/core/router/utils'
import baseTransition from '@/core/router/transition'
import fetch from '@/core/router/fetch'
import cache from '@/core/router/cache'
import historyManager from '@/core/router/history'
import eventBus from '@/core/modules/eventBus'
import * as Action from '@/core/router/actions'
import domify from 'domify'

/***
 * native lifecycle
 *
 * @return :object
 */
const lifecycle = (() => {
	/*
		setup to vars to share
	*/
	let matchRoute
	let exitTransition = {}
	let enterTransition = {}
	let wrapper

	return {
		/***
		 * @function addRoutes
		 * @param :array
		 *
		 * @return :lifecycle
		 */

		addRoutes(routes) {
			matchRoute = findRoute(routes)
			historyManager.store.from = matchRoute(window.location.pathname)

			return this
		},

		/***
		 * @function setWrapper
		 * @param :HTMLElement
		 *
		 * @return :lifecycle
		 */
		setWrapper(node) {
			wrapper = node

			return this
		},

		/***
		 *
		 * This function is called once upon load
		 *
		 * @function setWrapper
		 * @param :string
		 *
		 * @return :lifecycle
		 */
		onLoad(pathname) {
			const newState = matchRoute(pathname)

			const fn = Object.assign({}, baseTransition, newState.route.view)

			fn.onLoad(newState)

			eventBus.emit(Action.ROUTE_TRANSITION_LOAD, newState)

			return this
		},

		/***
		 *
		 * This function is called once upon load
		 *
		 * @function setWrapper
		 * @param :string
		 *
		 * @return :lifecycle
		 */
		transition({ pathname, action, transition: trans, dataAttrs }) {
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

			eventBus.emit(Action.ROUTE_TRANSITION_EXIT, exitProps)

			return Promise.all([
				promise('onExit', exitTransition, exitProps),
				fetch(pathname)
			])
				.then(([, resp]) => {
					eventBus.emit(Action.ROUTE_TRANSITION_RESOLVED, exitProps)
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

					const shouldUnmount = enterTransition.shouldUnmount(props)

					shouldUnmount &&
						eventBus.emit(Action.ROUTE_TRANSITION_BEFORE_DOM_UPDATE, props)

					enterTransition.updateDom(props)

					eventBus.emit(Action.ROUTE_TRANSITION_AFTER_DOM_UPDATE, props)

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

						eventBus.emit(Action.ROUTE_TRANSITION_ENTER, enterProps)

						promise('onEnter', enterTransition, enterProps).then(() => {
							enterTransition.onAfterEnter(enterProps)
							historyManager.store.from = newState
							eventBus.emit(Action.ROUTE_TRANSITION_COMPLETE, enterProps)
						})
					}

					return props
				})
		}
	}
})()

export default lifecycle
