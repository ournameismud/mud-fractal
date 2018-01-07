import { isFn, diff } from './utils'

let cacheStore = false
let memory = {}

export default ({ store, actions, context, listenTo = [] }) => {
	return function({ watch, listen }) {
		!cacheStore && store.subscribe(update)
		cacheStore = store
		let prevState = store.getState()
		function update() {
			const newState = store.getState()
			const changes = diff(prevState, newState)

			Object.keys(changes)
				.filter(key => isFn(watch[key]))
				.forEach(key => {
					watch[key].call(context, prevState[key], newState[key])
				})

			listenTo
				.filter(key => isFn(listen[key]))
				.forEach(key => listen[key](prevState[key], newState[key]))

			prevState = newState
		}

		return {
			emit(action, ...args) {
				memory[action] = [...args]
				actions[action] && store.dispatch(actions[action](...args))
			},

			getState() {
				return store.getState()
			},

			render() {
				Object.keys(actions).forEach(action => {
					actions[action] &&
						memory[action] &&
						store.dispatch(actions[action](...memory[action]))
				})
			}
		}
	}
}
