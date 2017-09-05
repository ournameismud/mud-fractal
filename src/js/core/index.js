import Delegate from 'dom-delegate'
import Concert from 'concert'
import Store from './store'
import isObject from 'lodash.isobject'
import Listener from './listener'
/*
	Base Class, 
*/
export default class Behaviour extends Concert {

	constructor(el = document, name) {
		super()
		/*
			A globally available event bus
		*/
		this.listener = new Listener()

		/*
			A globally available single state object
		*/
		this.store = new Store()


		/*
			Event delegation via dom-delegate
		*/
		this.$delegate = new Delegate(el)

		/*
			The DOM node that the behaviour is mounted on
		*/
		this.$el = el
		
		this.$body = document.body
		this.$html = document.getElementsByTagName('html')[0]

		/*
			Bind events
		*/
		this.delegate = this.delegate.bind(this)
		this.undelegate = this.undelegate.bind(this)
		this.initialize = this.initialize.bind(this)
		this.delegateEvents = this.delegateEvents.bind(this)
		this.unDelegateEvents = this.unDelegateEvents.bind(this)

		this.enabled = false

		/*
			Create a unique id
		*/
		this.cid = name
		return this
	}


	setState = (obj, name = this.cid) => {
		if(!isObject(obj)) {
			throw new Error('setState expects an object')
		}
		const { state } = this.store
		const next = {...state[name], ...obj}
		this.store.state = {[name]: next}
	
		return this
	}

	getGlobalState = () => {
		return this.store.state
	}
	
	getState = (name = this.cid) =>{
		return this.store.state[name]
	}

	events = {}
	
	/*
		Create event delegation from events objects
		@return this
	*/
	delegateEvents = () => {
		if(this.enabled) return

		this.enabled = true
		const events = this.events
		if(!events) return this
		for(let key in events) {
			const eventKey = events[key]
			const method = typeof eventKey === 'function' ? eventKey : this[eventKey]
			const parts = key.split(' ')
			this.delegate(parts[0], parts[1], method.bind(this))
		}
		return this
	}

	/*
		Remove event delegation from events objects
		@return this
	*/
	unDelegateEvents = () => {
		if(!this.enabled) return

		this.enabled = false

		const events = this.events
		if(!events) return this
		for(let key in events) {
			const eventKey = events[key]
			const method = typeof eventKey === 'function' ? eventKey : this[eventKey]
			const parts = key.split(' ')
			this.undelegate(parts[0], parts[1], method.bind(this))
		}
		return this
	}
	
	/*
		Delegate the events
		@return this
	*/
	delegate = (eventName, selector, listener) => {
		this.$delegate.on(eventName, selector, listener)
		return this
	}

	/*
		Remove delegated the events
		@return this
	*/
	undelegate = (eventName, selector, listener) => {
		this.$delegate.off(eventName, selector, this[listener])
		return this
	}
	
	/*
		Initialize the events
		@return this
	*/
	initialize = () => {
		this.delegateEvents()
		return this
	}

	/*
		Destory method, useful for page transitions
		@return this
	*/
	destroy = () => {
		if(typeof this.unmount === 'function') this.unmount()
		this.unDelegateEvents()
		for(let key in this){
			delete this[key]
		}
		return this
	}

	/*
		Method called after instantiation from the event queue
		@return void
	*/
	mounted() {}

	// unmount() {
	// 	log('unmounted in base')
	// }
}