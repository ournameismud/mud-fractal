import request from '@/core/router/request'
import fetchMock from 'fetch-mock'

fetchMock.get('/page-1.html', {
	body: 'page-1',
	status: 200
})

fetchMock.get('/page-2.html', {
	body: 'page-2',
	status: 200
})

fetchMock.get('/ddasdsad', {
	body: '404',
	status: 200,
	ok: false
})

describe('fetch function', () => {
	it('should be a function', () => {
		expect(request).toBeInstanceOf(Function)
	})

	it('should fetch the stuff', async () => {
		const resp = await request('/page-1.html')

		expect(resp).toBe('page-1')
	})

	it('should fetch return an error object when stuff fails', async () => {
		const resp = await request('/ddasdsad')

		const data = JSON.parse(resp) // ?

		expect(data).toMatchObject({
			ok: false
		})
	})
})
