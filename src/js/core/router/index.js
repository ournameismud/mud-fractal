import { createEvents } from '@/core/modules/createEvents'
import eventBus from '@/core/modules/eventBus'
import { composeProps } from '@/core/modules/refs'
import { preventClick, activeLinks, localLinks } from './utils/links'
import historyManager from './history'
import cache from './cache'
import request from './request'
import lifecycle from './lifecycle'
import lazyload from './lazyload'
import * as Action from './actions'

/**
 * @namespace RouterUtils
 */

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

	/**
	 * Create a router
	 * @namespace Router
	 *
	 * @class Router
	 *
	 * @property {Object} options
	 * @property {String} options.routes - an array of routes
	 * @property {HTMLElement} options.rootNode - the root html element
	 * @property {Array} options.navLinks - any array of anchors to update on transition
	 * @property {Object} options.classes.match - The class applied to matching linkes
	 * @property {Object} options.classes.root - The class applied to matching root link
	 * @property {Object} options.classes.parent - The class applied to mathcing parent link
	 *
	 */
	return class Router {
		constructor({
			routes,
			rootNode,
			navLinks,
			classes,
			onEnter,
			onExit,
			prefectTargets = '[data-prefetch]'
		}) {
			// bootup the lifecycle
			lifecycle
				.addRoutes(routes || defaultRoutes)
				.setWrapper(rootNode)
				.onLoad(window.location.pathname)

			this.prefectTargets = prefectTargets

			// the root node...
			this.$wrapper = rootNode
			this.$links = activeLinks({ scope: navLinks, classes })

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

		/** *
		 * @static goTo
		 * @memberof Router
		 * @property {Object} options
		 * @property {String} options.pathname - pathname for the page to navigate to
		 * @property {String} options.action - the type of history action
		 * @property {Object} options.dataAttrs - any data attributes on the link clicked
		 * @property {Object} transition - transition, a custom transition object
		 *
		 * @return {void}
		 */
		static goTo = ({ pathname, action, dataAttrs }, transition) => {
			lifecycle
				.transition({ pathname, action, transition, dataAttrs })
				.then(({ action, newHtml }) => {
					if (action === 'PUSH') {
						historyManager.push(pathname, { attr: dataAttrs })
					}
					log(newHtml)
					localLinks(newHtml)
				})
				.catch(err => {
					eventBus.emit(Action.ROUTER_PAGE_NOT_FOUND, err)
					// eslint-disable-next-line
					console.warn(`[PREFETCH] no page found at ${err.url}`)
				})
		}

		/** *
		 * @method onMouseEnter
		 * @memberof Router
		 * @description mouse enter event, triggers a fetch
		 * @property {Object} e - event object
		 * @property {HTMLElement} elm - the html element entered
		 *
		 * @return {void}
		 */
		onMouseEnter = (e, elm) => {
			const { pathname } = elm
			if (!preventClick(e, elm) || cache.get(pathname)) {
				return
			}

			request(pathname).catch(err => {
				// eslint-disable-next-line
				console.warn(`[PREFETCH] no page found at ${pathname}`, err)
			})
		}

		/** *
		 * @method onClick
		 * @memberof Router
		 * @description mouse click event, triggers a fetch
		 * @property {Object} e - event object
		 * @property {HTMLElement} elm - the html element entered
		 *
		 * @return {void}
		 */
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

		/** *
		 * @method mount
		 * @memberof Router
		 * @description Called after instantiation, boots everything up
		 *
		 * @return {Router}
		 */
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

			localLinks(document)

			this.$events.attachAll()

			return this
		}

		/** *
		 * @method lazyload
		 * @memberof Router
		 * @description prefetch content on a service worker
		 *
		 * @return {Router}
		 */
		lazyload = () => {
			const items = [...document.querySelectorAll(this.prefectTargets)]
			lazyload(items)
			return this
		}
	}
})()
