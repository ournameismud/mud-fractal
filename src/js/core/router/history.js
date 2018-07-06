import createHistory from 'history/createBrowserHistory'
import eventBus from '@/core/modules/eventBus'
import * as Action from './actions'

/**
 * @typedef {Object} History
 * @property {function} set Set an items into cache
 * @property {String} set.key Name of the item to cache
 * @property {Object} set.value Value of the item to cache
 * @property {function} get Get an item from the cache
 * @property {String} get.key Name of the item to get
 * @property {function} push push an item onto the history stack
 *
 */

/**
 * @memberof RouterUtils
 * @function historyManager
 * @return {History}
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
		set(key, value) {
			store[key] = value
		},

		get(key) {
			return store[key]
		},

		push(...args) {
			history.push(...args)
		}
	}
})()

export default historyManager
