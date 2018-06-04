import * as R from 'ramda'
import createEvents from '@/core/modules/createEvents'
import eventBus from '@/core/modules/eventBus'
import { composeProps } from '@/core/modules/refs'
import { preventClick, getLinks, activeLinks } from '@/core/router/utils/links'
import historyManager from '@/core/router/history'
import cache from '@/core/router/cache'
import request from '@/core/router/request'
import lifecycle from '@/core/router/lifecycle'
import Worker from '@/core/router/fetch.worker.js'
import * as Action from '@/core/router/actions'

export default (() => {
	// setup a worker
	const worker = new Worker()

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

	// add listen to events...
	worker.addEventListener('message', function({ data }) {
		// should probably check what i'm getting here
		// but... alpha... we're getting html responses
		log(R.filter(R.identity)(data))

		// data.forEach(({ key, data }) => {
		// 	log(data)
		// 	cache.set(key, { data })
		// })
	})

	/***
	 *@class Router
	 * @param :object
	 *
	 * @return Router
	 */
	return class Router {
		constructor({ routes, rootNode, navLinks, classes }) {
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
			const links = getLinks([...document.querySelectorAll('a')])

			links.length && worker.postMessage({ links })

			return this
		}
	}
})()
