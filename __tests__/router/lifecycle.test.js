import lifecycle from '@/core/router/lifecycle'
import historyManager from '@/core/router/history'
import fetchMock from 'fetch-mock'
import eventBus from '@/core/modules/eventBus'
import * as Action from '@/core/router/actions'

fetchMock.get('/', {
	body:
		'<html><head><title>New Page</title></head><body><div id="page-wrapper"><div class="page-child new-page">new</div></div></body></html>',
	status: 200
})

fetchMock.get('/page/', {
	body:
		'<html><head><title>New Page</title></head><body><div id="page-wrapper"><div class="page-child new-page">new</div></div></body></html>',
	status: 200
})

fetchMock.get('/page-1/', {
	body:
		'<html><head><title>New Page</title></head><body><div id="page-wrapper"><div class="page-child new-page">new-1</div></div></body></html>',
	status: 200
})

fetchMock.get('/fail', {
	body: false,
	status: 404,
	ok: false
})

describe('lifecycle function', () => {
	document.body.innerHTML = `<div id="page-wrapper">
															<div class="page-child old-page">
																old
															</div>
														</div>`

	const onLoad = jest.fn()
	const shouldUnmount = jest.fn()
	const shouldMount = jest.fn()
	const onExit = jest.fn()
	const onAfterExit = jest.fn()
	const onEnter = jest.fn()
	const onAfterEnter = jest.fn()

	const transitions = {
		el: '.page-child',

		onLoad() {
			document.querySelector(this.el).classList.add('onLoad')
			onLoad()
		},

		shouldUnmount() {
			shouldUnmount()
			return true
		},

		shouldMount() {
			shouldMount()
			return true
		},

		onError: props => {
			console.warn('error loading page', props)
		},

		onExit({ next }) {
			onExit()
			// console.table({ from: from.data.path, to: to.data.path, action }) // eslint-disable-line
			next()
		},

		onAfterExit() {
			onAfterExit()
		},

		onEnter({ next }) {
			onEnter()
			next()
		},

		onAfterEnter() {
			onAfterEnter()
		}
	}

	const routes = [
		{
			path: '/',
			name: 'root',
			view: transitions,
			options: {}
		},
		{
			path: '/page/',
			name: 'page',
			view: transitions,
			options: {}
		},
		{
			path: '*',
			name: 'default',
			view: transitions,
			options: {}
		}
	]

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

		const LOAD = jest.fn()

		eventBus.on(Action.ROUTE_TRANSITION_LOAD, LOAD)

		lifecycle.onLoad('/')
		expect(LOAD).toBeCalled()
		expect($p1.classList.contains('onLoad')).toBe(true)
	})

	it('should exit the page, remove the old dom and add the new one', async () => {
		let newNode = null
		let oldPage = document.querySelector('.old-page')
		expect(oldPage).not.toBe(null)

		await lifecycle
			.transition({
				pathname: '/page/',
				action: 'PUSH'
			})
			.then(() => {
				oldPage = document.querySelector('.old-page')
				newNode = document.querySelector('.new-page')
			})

		expect(newNode).not.toBe(null)
		expect(oldPage).toBe(null)
		expect(document.title).toBe('New Page')
	})

	it('should emit all of the route events', async () => {
		const EXIT = jest.fn()
		const RESOLVED = jest.fn()
		const BEFORE_DOM_UPDATE = jest.fn()
		const AFTER_DOM_UPDATE = jest.fn()
		const ENTER = jest.fn()
		const COMPLETE = jest.fn()

		eventBus.on(Action.ROUTE_TRANSITION_EXIT, EXIT)
		eventBus.on(Action.ROUTE_TRANSITION_RESOLVED, RESOLVED)
		eventBus.on(Action.ROUTE_TRANSITION_BEFORE_DOM_UPDATE, BEFORE_DOM_UPDATE)
		eventBus.on(Action.ROUTE_TRANSITION_AFTER_DOM_UPDATE, AFTER_DOM_UPDATE)
		eventBus.on(Action.ROUTE_TRANSITION_ENTER, ENTER)
		eventBus.on(Action.ROUTE_TRANSITION_COMPLETE, COMPLETE)

		await lifecycle.transition({
			pathname: '/page-1/',
			action: 'PUSH'
		})

		expect(EXIT).toBeCalled()
		expect(RESOLVED).toBeCalled()
		expect(BEFORE_DOM_UPDATE).toBeCalled()
		expect(AFTER_DOM_UPDATE).toBeCalled()
		expect(ENTER).toBeCalled()
		expect(COMPLETE).toBeCalled()
	})

	it('should emit all of the lifecyle events', async () => {
		await lifecycle.transition({
			pathname: '/page/',
			action: 'PUSH'
		})

		expect(onLoad).toBeCalled()
		expect(shouldUnmount).toBeCalled()
		expect(shouldMount).toBeCalled()
		expect(onExit).toBeCalled()
		expect(onAfterExit).toBeCalled()
		expect(onEnter).toBeCalled()
		expect(onAfterEnter).toBeCalled()
	})
})
