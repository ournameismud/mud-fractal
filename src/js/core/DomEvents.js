import Delegate from 'dom-delegate'

const transform = context => {
	const output = []
	for (let key in context.events) {
		const eventKey = context.events[key]
		const method = typeof eventKey === 'function' ? eventKey : context[eventKey]
		const parts = key.split(' ')
		const capture = parts[0].includes('mouse') ? true : false
		output.push([parts[0], parts[1], method.bind(context), capture])
	}
	return output
}

const bindDomEvents = context => {
	const $delegate = new Delegate(context.$el)
	let enabled = false

	return {
		addEvents: () => {
			if (enabled) return
			enabled = true
			if (!context.events) return this
			transform(context).forEach(event => $delegate.on(...event))
			return this
		},

		removeEvents: () => {
			if (!enabled && !context.events) return
			enabled = false
			transform(context).forEach(event => $delegate.off(...event))
			return this
		}
	}
}

export const DomEvents = superclass =>
	class extends superclass {
		addDomEvents = () => {
			this._domEvents = bindDomEvents(this)
			this._domEvents.addEvents()
			return this
		}

		removeDomEvents = () => {
			this._domEvents && this._domEvents.removeEvents()
			return this
		}
	}
