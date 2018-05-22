import createEvents from '@/core/modules/createEvents'
import eventBus from '@/core/modules/eventBus'
import createHistory from 'history/createBrowserHistory'
import domify from 'domify'
import { preventClick } from '@/core/utils/router.utils'

const history = createHistory()

export default class Router {
	constructor() {
		this.$wrapper = document.getElementById('page-wrapper')

		this.$events = createEvents.call(this, document, {
			'click a': 'onClick'
		})

		this.$unlisten = history.listen((location, action) => {
			if (this.cache[location.pathname]) {
				this.inject(this.cache[location.pathname])
			}

			const { pathname, state } = location

			eventBus.emit('history:change', {
				action,
				pathname,
				state
			})
			// location is an object like window.location
			log(action, location.pathname, location.state)
		})
	}

	cache = {}

	currentPath = null

	onClick = (e, elm) => {
		if (!preventClick(e, elm)) {
			return
		}

		e.stopPropagation()
		e.preventDefault()

		const { href, pathname } = elm

		eventBus.emit('history:request', { pathname })

		if (this.cache[pathname]) {
			history.push(pathname, { some: 'state' })
			return
		}

		fetch(href)
			.then(response => response.text())
			.then(data => {
				this.cache[pathname] = data
				history.push(pathname, { some: 'state' })
			})
	}

	inject = html => {
		log('INJECTING')
		const $html = domify(html)
		this.$wrapper.innerHTML = ''
		this.$wrapper.appendChild($html.querySelector('.page-child'))
	}

	mount = () => {
		this.$events.attachAll()
	}
}
