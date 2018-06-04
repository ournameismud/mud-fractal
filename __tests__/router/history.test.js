import historyManager from '@/core/router/history'

describe('history function', () => {
	it('should be a Object', () => {
		expect(historyManager).toBeInstanceOf(Object)
	})

	it('should have a push method', () => {
		expect(historyManager.push).toBeInstanceOf(Function)
	})

	it('should set/gets items in the historyManager', () => {
		const item = { data: 2 }
		historyManager.set('from', item)
		const getItem = historyManager.get('from')

		expect(getItem.data).toBe(item.data)
	})
})
