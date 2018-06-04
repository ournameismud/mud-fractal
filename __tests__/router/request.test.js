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
	body: '500',
	status: 500,
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

	// i'm not sure what this is really proving... ermmm...
	// have a look at the lifecycle, the error response should be handled there
	// hmmmm
	it('should fetch return an error object when stuff fails', async () => {
		const resp = await request('/ddasdsad')

		const data = JSON.parse(resp) // ?

		expect(data).toMatchObject({
			ok: false
		})
	})

	afterAll(async done => {
		fetchMock.restore()
		done()
	})
})
