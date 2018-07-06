import cache from '@/core/router/cache'

describe('cache function', () => {
	it('should be a Object', () => {
		expect(cache).toBeInstanceOf(Object)
	})

	it('should set/gets items in the cache', () => {
		const item = { data: 2 }
		cache.set('test', item)
		const getItem = cache.get('test')

		expect(getItem.data).toBe(item.data)
	})
})
