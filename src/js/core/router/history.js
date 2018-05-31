import createHistory from 'history/createBrowserHistory'
import eventBus from '@/core/modules/eventBus'
import * as Action from '@/core/router/actions'

/***
 *
 * Create a history listener and listen for stuff
 *
 * @return object
 */
const historyManager = (() => {
	// create a new history instance
	const history = createHistory()

	// listen to any history changes
	history.listen((location, action) => {
		const { pathname, state } = location
		// if 'POP'... i.e forward/backward
		// emit the event
		if (action === 'POP') {
			eventBus.emit(Action.ROUTER_POP_EVENT, { pathname, state })
		}
	})

	return {
		/*
			refactor alert yo!
		*/
		store: {
			from: '',
			to: ''
		},

		/*
			wrapper function
			
			eg: history.push('/home', { some: 'state' })
		*/
		push(...args) {
			history.push(...args)
		}
	}
})()

export default historyManager
