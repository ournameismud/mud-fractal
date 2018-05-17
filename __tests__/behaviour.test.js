import Behaviour from '@/core/behaviour'
import eventBus from '@/core/eventBus'

class ExampleWithAllTheBitsCovered extends Behaviour {
	mount = () => {
		this.$el.classList.add('mount')
		this.$events.attachAll()
	}

	unmount = () => {
		this.$el.classList.add('unmount')
	}

	events = {
		'click [data-link]': 'onClick'
	}

	onClick = (e, elm) => {
		e.preventDefault()
		elm.classList.toggle('huzzah')
	}

	routes = {
		enter: () => {
			this.$el.classList.toggle('enter')
		},
		exit: () => {
			this.$el.classList.toggle('exit')
		}
	}
}

describe('behaviour class', () => {
	document.body.innerHTML = `<div id="test" data-behaviour="ModuleB">
															<div data-element="item" data-prop1="a" data-prop2="b">
																<a href="#0" data-link>Link</a>
															</div>
                            </div>`

	const $el = document.getElementById('test')
	let behaviour

	beforeAll(async done => {
		behaviour = new ExampleWithAllTheBitsCovered($el, 'Test')
		behaviour.init()
		setTimeout(() => {
			behaviour.mount()
			done()
		})
	})

	it('should be a function', () => {
		expect(ExampleWithAllTheBitsCovered).toBeInstanceOf(Function)
	})

	it('should mount', () => {
		expect(behaviour.$el.classList.contains('mount')).toBe(true)
	})

	it('should have an $el property that matches the target element', () => {
		expect(behaviour.$el).toBe($el)
	})

	it('should link to the global event bus', () => {
		const { $eventBus } = behaviour

		expect($eventBus).toBe(eventBus)
		expect($eventBus.on).toBeInstanceOf(Function)
		expect($eventBus.emit).toBeInstanceOf(Function)
		expect($eventBus.off).toBeInstanceOf(Function)

		let tempValue = 0

		const funk = () => (tempValue += 1)

		$eventBus.on('update', funk)

		$eventBus.emit('update')
		$eventBus.off('update', funk)
		$eventBus.emit('update')

		expect(tempValue).toBe(1)
	})

	it('should have a $refs object containing any data-elemenet items and there data-attributes', () => {
		expect(behaviour.$refs).toBeInstanceOf(Object)

		const target = {
			node: document.querySelector('[data-element="item"]'),
			prop1: 'a',
			prop2: 'b'
		}

		behaviour.$refs.item.node.classList.add('test')

		expect(behaviour.$refs.item).toMatchObject(target)
		expect(target.node.classList.contains('test')).toBe(true)
	})

	it('should have an events object with 5 methods', () => {
		const { $events } = behaviour
		expect($events).toBeInstanceOf(Object)
		expect($events.attachAll).toBeInstanceOf(Function)
		expect($events.attach).toBeInstanceOf(Function)
		expect($events.remove).toBeInstanceOf(Function)
		expect($events.destroy).toBeInstanceOf(Function)
		expect($events.emit).toBeInstanceOf(Function)
	})

	it('should attach the event listeners', () => {
		document.querySelector('[data-link]').click()

		expect(
			document.querySelector('[data-link]').classList.contains('huzzah')
		).toBe(true)
	})

	it('should respond to router events', () => {
		eventBus.emit('routes:enter')
		eventBus.emit('routes:exit')

		expect(behaviour.$el.classList.contains('enter')).toBe(true)
		expect(behaviour.$el.classList.contains('exit')).toBe(true)
	})

	it('should unmount when being destroyed', () => {
		behaviour.destroy()
		expect(behaviour.$el.classList.contains('unmount')).toBe(true)
	})

	it('should remove all events when destroyed', () => {
		behaviour.destroy()

		document.querySelector('[data-link]').click()
		eventBus.emit('routes:enter')
		eventBus.emit('routes:exit')

		expect(behaviour.$el.classList.contains('enter')).toBe(true)
		expect(behaviour.$el.classList.contains('exit')).toBe(true)

		expect(
			document.querySelector('[data-link]').classList.contains('huzzah')
		).toBe(true)
	})
})
