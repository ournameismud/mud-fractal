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

const worker = new Worker()

const getLinks = R.compose(
	R.filter(
		pathname => pathname !== window.location.pathname && !cache.get(pathname)
	),
	R.map(R.prop('pathname')),
	R.filter(link => !preventClick({}, link.pathname))
)

worker.addEventListener('message', function({ data }) {
	data.forEach(({ key, data }) => {
		cache.set(key, { data })
	})
})

export default class Router {
	constructor({ routes, rootNode }) {
		this.$routes = flattenRoutes(routes)

		log(this.$routes)

		lifecycle
			.addRoutes(this.$routes)
			.setWrapper(rootNode)
			.onLoad(window.location.pathname)

		this.$findRoute = findRoute(this.$routes)

		this.$wrapper = rootNode

		this.$events = createEvents.call(this, document, {
			'click a': 'onClick',
			'mouseover a': 'onMouseEnter'
		})
	}

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
