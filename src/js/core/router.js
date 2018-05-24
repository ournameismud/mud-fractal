import createEvents from '@/core/modules/createEvents'
import eventBus from '@/core/modules/eventBus'

import { preventClick, flattenRoutes, findRoute } from '@/core/router/utils'
import historyManager from '@/core/router/history'
import cache from '@/core/router/cache'
import fetch from '@/core/router/fetch'
import lifecycle from '@/core/router/lifecycle'

export default class Router {
	constructor({ routes, wrapper = 'page-wrapper' }) {
		this.$routes = flattenRoutes(routes)

		lifecycle.addRoutes(this.$routes)

		this.$findRoute = findRoute(this.$routes)

		this.$wrapper = document.getElementById(wrapper)

		this.$events = createEvents.call(this, document, {
			'click a': 'onClick',
			'mouseover a': 'onMouseEnter'
		})
	}

	static goTo = (pathname, transition) => {
		lifecycle.exit(pathname, transition).then(() => {
			historyManager.push(pathname, { some: 'state' })
		})
	}

	onMouseEnter = (e, elm) => {
		const { pathname } = elm
		if (!preventClick(e, elm) || cache.get(pathname)) {
			return
		}
		fetch(pathname)
	}

	onClick = (e, elm) => {
		const { pathname } = elm

		if (!preventClick(e, elm)) {
			return
		}

		e.stopPropagation()
		e.preventDefault()

		if (pathname === window.location.pathname) return

		Router.goTo(pathname)
	}

	mount = () => {
		eventBus.on('__route-pop__', pathname => {
			lifecycle.exit(pathname)
		})

		this.$events.attachAll()
	}
}
