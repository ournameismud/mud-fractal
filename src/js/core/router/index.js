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
	 * @param {Object} options
	 * @param {String} options.routes - an array of routes
	 * @param {HTMLElement} options.rootNode - the root html element
	 * @param {Array} options.navLinks - any array of anchors to update on transition
	 * @param {Object} options.classes.match - The class applied to matching linkes
	 * @param {Object} options.classes.root - The class applied to matching root link
	 * @param {Object} options.classes.parent - The class applied to mathcing parent link
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
			prefetchTargets = '[data-prefetch]'
		}) {
			// bootup the lifecycle
			lifecycle
				.addRoutes(routes || defaultRoutes)
				.setWrapper(rootNode)
				.onLoad(window.location.pathname)

			this.prefetchTargets = prefetchTargets

			// the root node...
			this.$wrapper = rootNode
			this.$links = activeLinks({ scope: navLinks, classes })

			// set the dom events
			this.$events = createEvents.call(this, document, {
				'click a': 'onClick',
				'mouseover a': 'onMouseEnter'
			})

			eventBus.on(Action.ROUTE_TRANSITION_BEFORE_DOM_UPDATE, onExit)

			eventBus.on(Action.ROUTE_TRANSITION_AFTER_DOM_UPDATE, onEnter)

			return this
		}

		/** *
		 * @static goTo
		 * @memberof Router
		 * @param {Object} options
		 * @param {String} options.pathname - pathname for the page to navigate to
		 * @param {String} options.action - the type of history action
		 * @param {Object} options.dataAttrs - any data attributes on the link clicked
		 * @param {Object} transition - transition, a custom transition object
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
					localLinks(newHtml)
				})
				.catch(err => {
					eventBus.emit(Action.ROUTER_PAGE_NOT_FOUND, err)
					// eslint-disable-next-line
					console.warn(`[PREFETCH] no page found at ${err}`)
				})
		}

		/** *
		 * @method onMouseEnter
		 * @memberof Router
		 * @description mouse enter event, triggers a fetch
		 * @param {Object} e - event object
		 * @param {HTMLElement} elm - the html element entered
		 *
		 * @return {void}
		 */
		onMouseEnter = (e, elm) => {
			const { pathname } = elm
			if (
				!preventClick(e, elm) ||
				cache.get(pathname) ||
				elm.classList.contains('---is-fetching---')
			) {
				return
			}

			elm.classList.add('---is-fetching---')

			request(pathname)
				.then(() => {
					elm.classList.remove('---is-fetching---')
				})
				.catch(err => {
					// eslint-disable-next-line
					console.warn(`[PREFETCH] no page found at ${pathname}`, err)
				})
		}

		/** *
		 * @method onClick
		 * @memberof Router
		 * @description mouse click event, triggers a fetch
		 * @param {Object} e - event object
		 * @param {HTMLElement} elm - the html element entered
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

			lazyload.cancel()
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
				({
					to: {
						params: { raw: url }
					}
				}) => {
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
			const items = [...document.querySelectorAll(this.prefetchTargets)]
			lazyload.fetch(items)
			return this
		}
	}
})()
