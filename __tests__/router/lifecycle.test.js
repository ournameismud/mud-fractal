import lifecycle from '@/core/router/lifecycle'
import historyManager from '@/core/router/history'
import routes from './routes'
import fetchMock from 'fetch-mock'

fetchMock.get('/page', {
	body:
		'<html><head><title>New Page</title></head><body><div id="page-wrapper"><div class="page-child new-page">new</div></div></body></html>',
	status: 200
})

fetchMock.get('/fail', {
	body: false,
	status: 500,
	data: {
		ok: false
	}
})

describe('lifecycle function', () => {
	document.body.innerHTML = `<div id="page-wrapper">
															<div class="page-child old-page">
																old
															</div>
														</div>`

	let $wrapper = document.getElementById('page-wrapper')
	let $p1 = document.querySelector('.page-child')

	it('should be a Object', () => {
		expect(lifecycle).toBeInstanceOf(Object)
	})

	it('should have some methods', () => {
		expect(lifecycle.addRoutes).toBeInstanceOf(Function)
		expect(lifecycle.setWrapper).toBeInstanceOf(Function)
		expect(lifecycle.onLoad).toBeInstanceOf(Function)
		expect(lifecycle.transition).toBeInstanceOf(Function)
	})

	it('should add the routes and set the current history item', () => {
		lifecycle.addRoutes(routes)

		const history = historyManager.get('from')
		expect(history.path).toBe('/')
	})

	it('the onload method should be called', () => {
		lifecycle.setWrapper($wrapper)
		lifecycle.onLoad('/')

		expect($p1.classList.contains('onLoad')).toBe(true)
	})

	// it('should exit the page, remove the old dom and add the new one', async () => {
	// 	let newNode = null
	// 	let oldPage = document.querySelector('.old-page')
	// 	expect(oldPage).not.toBe(null)

	// 	await lifecycle
	// 		.transition({
	// 			pathname: '/page',
	// 			action: 'PUSH'
	// 		})
	// 		.then(() => {
	// 			oldPage = document.querySelector('.old-page')
	// 			newNode = document.querySelector('.new-page')
	// 		})

	// 	expect(newNode).not.toBe(null)
	// 	expect(oldPage).toBe(null)
	// 	expect(document.title).toBe('New Page')
	// })

	it('should trigger the onError method if it fails', async () => {
		await lifecycle.transition({
			pathname: '/fail',
			action: 'PUSH'
		})

		expect(document.body.classList.contains('onError')).toBe(true)
	})
})
