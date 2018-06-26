import createHistory from 'history/createBrowserHistory'
import eventBus from '@/core/modules/eventBus'
import * as Action from './actions'

/** *
 *
 * Create a history listener and listen for stuff
 *
 * @return object
 */
const historyManager = (() => {
	// create a new history instance
	const history = createHistory()
	// object to how the current/previous paths
	const store = {}

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
		/** *
		 * set('string', value)
		 *
		 * set an item into the history store
		 *
		 * @param {String}, :any
		 *
		 * @return {void}
		 */
		set(key, value) {
			store[key] = value
		},

		/** *
		 * get('string')
		 *
		 * get an item from the history store
		 *
		 * @param {String}
		 *
		 * @return :any
		 */
		get(key) {
			return store[key]
		},

		/*
			wrapper function
			
			eg: 
		*/

		/** *
		 * push('path', opts = {})
		 *
		 * history.push('/home', { some: 'state' })
		 *
		 * @param {String}
		 * @param {Object}
		 *
		 * @return :any
		 */
		push(...args) {
			history.push(...args)
		}
	}
})()

export default historyManager
