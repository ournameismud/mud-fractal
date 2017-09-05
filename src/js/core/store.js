/*
	A global state object thinger
	Returns a single instance
*/
let _storeInstance = null

export default class Store {
	constructor() {
		if(!_storeInstance){
			_storeInstance = this
		}
		return _storeInstance
	}

	_state = {}

	set state(newState) {
		const oldState = this._state
		const nextState = {...oldState, ...newState}
		this._state = nextState
	}

	get state() {
		return this._state
	}
}
