import createHistory from 'history/createBrowserHistory'
import eventBus from '@/core/modules/eventBus'
import * as Action from '@/core/router/actions'

const historyManager = (() => {
	const history = createHistory()

	history.listen((location, action) => {
		const { pathname, state } = location
		if (action === 'POP') {
			eventBus.emit(Action.ROUTER_POP_EVENT, { pathname, state })
		}
	})

	return {
		store: {
			from: '',
			to: ''
		},

		push(...args) {
			history.push(...args)
		}
	}
})()

export default historyManager
