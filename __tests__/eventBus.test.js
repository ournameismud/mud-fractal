import eventBus from '@/core/modules/eventBus'

describe('loader function', () => {
	it('should be a function', () => {
		expect(eventBus).toBeInstanceOf(Object)
	})

	it('should return 3 methods [emit, on, off]', () => {
		expect(eventBus.emit).toBeInstanceOf(Function)
		expect(eventBus.on).toBeInstanceOf(Function)
		expect(eventBus.off).toBeInstanceOf(Function)
	})

	it('should respone to emmited events', async () => {
		let temp = 0

		const fn = () => (temp += 1)
		eventBus.on('some:funk', fn)
		eventBus.emit('some:funk')
		eventBus.off('some:funk', fn)
		eventBus.emit('some:funk')
		expect(temp).toBe(1)
	})
})
