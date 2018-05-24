import createHistory from 'history/createBrowserHistory'
import eventBus from '@/core/modules/eventBus'

const historyManager = (() => {
	const history = createHistory()

	history.listen((location, action) => {
		const { pathname, state } = location
		if (action === 'POP') {
			eventBus.emit('__route-pop__', pathname)
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
