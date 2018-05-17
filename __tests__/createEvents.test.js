import createEvents from '@/core/createEvents'

describe('create events function', () => {
	document.body.innerHTML = `<div id="test">
                              <a href="#" data-a></a>
                              <a href="#" data-b></a>
                              <a href="#" data-c></a>
                              <a href="#" data-d></a>
                            </div>`

	let onClick1
	let onClick2
	let onClick3
	let onClick4
	let onKeyDown

	/*
		Handle
	*/
	let events

	beforeEach(() => {
		onClick1 = jest.fn()
		onClick2 = jest.fn()
		onClick3 = jest.fn()
		onClick4 = jest.fn((e, node) => {
			node.classList.add('test')
		})
		onKeyDown = jest.fn()

		events = createEvents(document.body, {
			'click [data-a]': onClick1,
			'click [data-b]': onClick2,
			'click [data-c]': onClick3,
			'click [data-d]': onClick4,
			keydown: onKeyDown
		})
	})

	afterEach(() => {
		events.destroy()
	})

	it('should be a function', () => {
		expect(createEvents).toBeInstanceOf(Function)
	})

	it('should return 5 methods [attachAll, attach, remove, destroy, emit]', () => {
		expect(events.attachAll).toBeInstanceOf(Function)
		expect(events.attach).toBeInstanceOf(Function)
		expect(events.remove).toBeInstanceOf(Function)
		expect(events.destroy).toBeInstanceOf(Function)
		expect(events.emit).toBeInstanceOf(Function)
	})

	it('should add all of the events when calling attachAll', () => {
		events.attachAll()
		document.querySelector('[data-a]').click()
		document.querySelector('[data-b]').click()
		document.querySelector('[data-c]').click()

		expect(onClick1).toBeCalled()
		expect(onClick2).toBeCalled()
		expect(onClick3).toBeCalled()
	})

	it('should only attach events supplied when using attach', () => {
		events.attach(['click [data-a]', 'click [data-b]'])
		document.querySelector('[data-a]').click()
		document.querySelector('[data-b]').click()
		document.querySelector('[data-c]').click()

		expect(onClick1).toBeCalled()
		expect(onClick2).toBeCalled()
		expect(onClick3).not.toBeCalled()
	})

	it('should remove all events when destroy is called', () => {
		events.attachAll()
		document.querySelector('[data-a]').click()
		document.querySelector('[data-b]').click()
		document.querySelector('[data-c]').click()

		events.destroy()

		document.querySelector('[data-a]').click()
		document.querySelector('[data-b]').click()
		document.querySelector('[data-c]').click()

		expect(onClick1.mock.calls.length).toBe(1)
		expect(onClick2.mock.calls.length).toBe(1)
		expect(onClick3.mock.calls.length).toBe(1)
	})

	it('should remove events supplied when using remove', () => {
		events.attachAll()

		events.remove(['click [data-b]', 'click [data-c]'])

		document.querySelector('[data-a]').click()
		document.querySelector('[data-b]').click()
		document.querySelector('[data-c]').click()

		expect(onClick1).toBeCalled()
		expect(onClick2).not.toBeCalled()
		expect(onClick3).not.toBeCalled()
	})

	it('should emit a function when called', () => {
		events.attachAll()
		events.emit(document.querySelector('[data-d]'), 'click')

		events.emit(document.body, 'keydown')

		expect(onClick4).toBeCalled()
		expect(onKeyDown).toBeCalled()

		expect(document.querySelector('[data-d]').classList.contains('test')).toBe(
			true
		)
	})
})
