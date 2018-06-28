import Delegate from 'dom-delegate'
import * as R from 'ramda'

// do not use an array function... we need to be able to bind
export const createEvents = R.curry(function(context, obj) {
	const events = Object.entries(obj).map(([key, fn]) => {
		const eventAndNode = R.compose(R.map(R.trim), R.split(' '))(key)
		const capture = !!R.compose(R.length, R.match(/(blur|mouse)/g), R.head)(
			eventAndNode
		)
		const funk = typeof fn === 'string' ? this[fn] : fn
		return [...eventAndNode, funk, capture]
	})

	let $delegate
	let emit

	const handleFunctions = R.curry((evt, transform, fns) => {
		R.compose(
			R.forEach(event => {
				$delegate[transform](...event)
			}),
			R.map(item =>
				R.find(([a, b]) => {
					// alls add/remove of events without a selector - things like keydown/keyup
					if (typeof b === 'function') {
						return a === item
					}
					return [a, b].join(' ') === item
				})(evt)
			)
		)(fns)
	})(events)

	return {
		attachAll(root = context) {
			$delegate = $delegate || new Delegate(root)
			try {
				R.forEach(event => $delegate.on(...event))(events)
			} catch (err) {
				// eslint-disable-next-line
				console.error(
					'Handler must be a type of Function, careful with arrow functions, they will need to be above the events object:',
					err
				)
			}
		},

		attach(fns, root = context) {
			$delegate = $delegate || new Delegate(root)
			handleFunctions('on', fns)
		},

		remove(fns) {
			if (!$delegate) return
			handleFunctions('off', fns)
		},

		destroy() {
			if (!$delegate) return
			R.forEach(event => $delegate.off(...event))(events)
		},

		emit($node, event) {
			emit = emit || document.createEvent('HTMLEvents')
			emit.initEvent(event, true, false)
			$node.dispatchEvent(emit)
		}
	}
})

/**
 * Create a router
 * @mixin EventsMixin
 * @description class used to manage adding/removing delegated dom events
 *
 * @example
 * import Behaviour, { mix } from '@/core/Behaviour'
 * import {
 * 	EventsMixin,
 * } from '@/core/modules/'
 *
 * export default class ExampleWithAllTheThings extends mix(Behaviour).with(
 * 	EventsMixin
 * ) {
 * 	events = {
 * 		'click [data-link]': 'onClick'
 * 	}
 *
 * 	mount = () => {
 * 		// attach all the events
 * 		this.$$events.attachAll()
 * 		// attach events by key
 * 		this.$$events.attach(['click [data-link]'])
 * 		// remove events by key
 * 		this.$$events.remove(['click [data-link]'])
 * 		// destroy all the events
 * 		this.$$events.destroy()
 * 	}
 *
 * 	onClick = (e, elm) => {
 * 		e.preventDefault()
 * 		elm.classList.toggle('huzzah')
 * 	}
 * }
 * @return {EventsMixin}
 */
export const EventsMixin = superclass =>
	class extends superclass {
		init() {
			this.$$events = createEvents.call(this, this.$el, this.events)

			if (super.init) super.init()

			return this
		}

		destroy() {
			this.$$events.destroy()
			if (super.destroy) super.destroy()
		}
	}
