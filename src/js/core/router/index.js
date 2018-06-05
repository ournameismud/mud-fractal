import createEvents from '@/core/modules/createEvents'
import eventBus from '@/core/modules/eventBus'
import { composeProps } from '@/core/modules/refs'
import { preventClick, activeLinks } from '@/core/router/utils/links'
import historyManager from '@/core/router/history'
import cache from '@/core/router/cache'
import request from '@/core/router/request'
import lifecycle from '@/core/router/lifecycle'
import lazyload from '@/core/router/lazyload'
import * as Action from '@/core/router/actions'

export default (() => {
	const defaultRoutes = [
		{
			path: '/',
			view: {}
		},
		{
			path: '*',
			view: {}
		}
	]

	/***
	 *@class Router
	 * @param :object
	 *
	 * @return Router
	 */
	return class Router {
		constructor({ routes, rootNode, navLinks, classes, onEnter, onExit }) {
			// bootup the lifecycle
			lifecycle
				.addRoutes(routes || defaultRoutes)
				.setWrapper(rootNode)
				.onLoad(window.location.pathname)

			// the root node... ?? configurable at the route level
			this.$wrapper = rootNode
			this.$links = activeLinks({ scope: navLinks, classes: classes })

			// set the dom events
			this.$events = createEvents.call(this, document, {
				'click a': 'onClick',
				'mouseover a': 'onMouseEnter'
			})

			eventBus.on(Action.ROUTE_TRANSITION_BEFORE_DOM_UPDATE, (...props) => {
				onExit(...props)
			})

			eventBus.on(Action.ROUTE_TRANSITION_AFTER_DOM_UPDATE, (...props) => {
				onEnter(...props)
			})

			return this
		}

		/***
		 * @static goTo
		 * @param :object
		 *
		 * @return void
		 */
		static goTo = ({ pathname, action, dataAttrs }, transition) => {
			lifecycle
				.transition({ pathname, action, transition, dataAttrs })
				.then(({ action }) => {
					if (action === 'PUSH') {
						historyManager.push(pathname, { attr: dataAttrs })
					}
				})
				.catch(e => {
					eventBus.emit(Action.ROUTER_PAGE_NOT_FOUND, e)
					console.warn(`[PREFETCH] no page found at ${e.url}`)
				})
		}

		onMouseEnter = (e, elm) => {
			const { pathname } = elm
			if (!preventClick(e, elm) || cache.get(pathname)) {
				// log('NARP')
				return
			}

			request(pathname).catch(err => {
				console.warn(`[PREFETCH] no page found at ${pathname}`)
			})
		}

		onClick = (e, elm) => {
			const { pathname } = elm

			if (!preventClick(e, elm)) {
				return
			}

			e.stopPropagation()
			e.preventDefault()

			if (pathname === window.location.pathname) return

			const dataAttrs = composeProps([...elm.attributes])

			Router.goTo({ pathname, dataAttrs, action: 'PUSH' })
		}

		mount = () => {
			eventBus.on(Action.ROUTER_POP_EVENT, ({ pathname }) => {
				lifecycle.transition({ pathname, action: 'POP' })
			})

			eventBus.on(
				Action.ROUTE_TRANSITION_AFTER_DOM_UPDATE,
				({ to: { params: { raw: url } } }) => {
					this.$links(url)
				}
			)

			this.$events.attachAll()

			return this
		}

		lazyload = () => {
			const items = [...document.querySelectorAll('a')]
			lazyload(items)
			return this
		}
	}
})()
