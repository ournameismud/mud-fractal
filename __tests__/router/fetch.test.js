import fetch from '@/core/router/fetch'
import fetchMock from 'fetch-mock'

fetchMock.get('/page-1.html', {
	body: 'page-1',
	status: 200
})

fetchMock.get('/page-2.html', {
	body: 'page-2',
	status: 200
})

describe('fetch function', () => {
	it('should be a function', () => {
		expect(fetch).toBeInstanceOf(Function)
	})

	it('should fetch the stuff', async () => {
		const resp = await fetch('/page-1.html')

		expect(resp).toBe('page-1')
	})
})
