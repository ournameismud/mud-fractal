import Delegate from 'dom-delegate'

const transform = (events, obj) => {
	const output = []
	for (let key in events) {
		const eventKey = events[key]
		const method = typeof eventKey === 'function' ? eventKey : obj[eventKey]
		const parts = key.split(' ')
		const capture = parts[0].includes('mouse') ? true : false
		output.push([parts[0], parts[1], method, capture])
	}
	return output
}

/*
	Base Class, 
*/
export const bindDomEvents = (el = document, events = {}, behaviour) => {
	const $delegate = new Delegate(el)
	let enabled = false

	return {
		addEvents: () => {
			if (enabled) return
			enabled = true
			if (!events) return this
			transform(events, behaviour).forEach(event => $delegate.on(...event))
			return this
		},

		removeEvents: () => {
			if (!enabled && !events) return
			enabled = false
			transform(events, behaviour).forEach(event => $delegate.off(...event))
			return this
		}
	}
}

export const DomEvents = superclass =>
	class extends superclass {
		addDomEvents = () => {
			this._domEvents = bindDomEvents(this.$el, this.events, this)
			this._domEvents.addEvents()
			return this
		}

		removeDomEvents = () => {
			this._domEvents && this._domEvents.removeEvents()
			return this
		}
	}
