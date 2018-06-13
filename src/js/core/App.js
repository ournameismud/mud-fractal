import loader from '@/core/modules/loader'
import eventBus from '@/core/modules/eventBus'
import Router from '@/core/router/'
import * as Actions from '@/core/router/actions'

export default (() =>
	class App {
		constructor({ router, chunks }) {
			if (router) {
				this.$router = new Router({ ...router })
			}

			this.$loader = loader(chunks)
		}

		mount = () => {
			this.$loader.hydrate(document)

			if (this.$router) this.$router.mount().lazyload()

			eventBus.on(Actions.ROUTE_TRANSITION_BEFORE_DOM_UPDATE, () => {
				this.$loader.unmount()
			})

			eventBus.on(Actions.ROUTE_TRANSITION_AFTER_DOM_UPDATE, ({ newHtml }) => {
				this.$loader.hydrate(newHtml)
				this.$router.lazyload()
			})
		}
	})()
