import * as R from 'ramda'
import createEvents from '@/core/modules/createEvents'
import eventBus from '@/core/modules/eventBus'
import { composeProps } from '@/core/modules/refs'
import { preventClick, flattenRoutes, findRoute } from '@/core/router/utils'
import historyManager from '@/core/router/history'
import cache from '@/core/router/cache'
import fetch from '@/core/router/fetch'
import lifecycle from '@/core/router/lifecycle'
import Worker from '@/core/router/fetch.worker.js'
import * as Action from '@/core/router/actions'

export default (() => {
	// setup a worker
	const worker = new Worker()

	// add listen to events...
	worker.addEventListener('message', function({ data }) {
		// should probably check what i'm getting here
		// but... alpha... we're getting html responses
		data.forEach(({ key, data }) => {
			cache.set(key, { data })
		})
	})

	// get the good links
	// probably move to utils
	const getLinks = R.compose(
		R.filter(
			pathname => pathname !== window.location.pathname && !cache.get(pathname)
		),
		R.map(R.prop('pathname')),
		R.filter(link => !preventClick({}, link.pathname))
	)

	/***
	 *@class Router
	 * @param :object
	 *
	 * @return Router
	 */
	return class Router {
		constructor({ routes, rootNode }) {
			// setup routes.... <REWITE></REWITE>
			this.$routes = flattenRoutes(routes)

			// bootup the lifecycle
			lifecycle
				.addRoutes(this.$routes)
				.setWrapper(rootNode)
				.onLoad(window.location.pathname)

			// get the routes method built... <REWITE></REWITE>
			this.$findRoute = findRoute(this.$routes)

			// the root node... ?? configurable at the route level
			this.$wrapper = rootNode

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

			fetch(pathname).catch(err => {
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
