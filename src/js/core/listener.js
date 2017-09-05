import Concert from 'concert'
/*
	Global Event Bus
	Returns a single instance
*/
let _listenerInstance = null
export default class Listener extends Concert {
	constructor() {
		super()
		if(!_listenerInstance){
			_listenerInstance = this
		}
		return _listenerInstance
	}
}