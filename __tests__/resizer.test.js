import resizer from '@/core/resizer'

describe('resize function', () => {
	beforeEach(async done => {
		window.resizeTo(500, 500)
		setTimeout(() => {
			done()
		})
	})

	it('should be a function', () => {
		expect(resizer).toBeInstanceOf(Function)
	})

	it('should find the current width and height', () => {
		const r = resizer()
		const { width, height } = r
		expect(width).toBe(500)
		expect(height).toBe(500)
	})

	it('should trigger an event when the window changes size', async () => {
		const r = resizer()
		const onResize = jest.fn()
		r.on('window:resize', onResize)

		await new Promise(resolve => {
			window.resizeTo(79, 1000)
			setTimeout(() => {
				resolve()
			}, 10)
		})

		expect(onResize).toBeCalled()
	})

	it('should get the new width/height when requested', async () => {
		const r = resizer()

		expect(r.width).toBe(500)
		expect(r.height).toBe(500)

		await new Promise(resolve => {
			window.resizeTo(79, 1000)
			setTimeout(() => {
				resolve()
			}, 10)
		})

		expect(r.width).toBe(79)
		expect(r.height).toBe(1000)
	})

	it('should trigger events based on the events object passed', async () => {
		const onResizePass = jest.fn()
		const onResizeFail = jest.fn()
		const r = resizer({
			'(min-width: 600px)': onResizePass,
			'(min-width: 200px)': onResizeFail
		})

		await new Promise(resolve => {
			window.resizeTo(501, 1000)
			setTimeout(() => {
				resolve()
			}, 10)
		})

		expect(onResizePass).toBeCalled()
		expect(onResizeFail).not.toBeCalled()
	})

	it('should remove all of the events when calling the destroy method', async () => {
		const onResizePass = jest.fn()
		const onResizeFail = jest.fn()
		const r = resizer({
			'(min-width: 600px)': onResizePass,
			'(min-width: 200px)': onResizeFail
		})

		r.destroy()

		await new Promise(resolve => {
			window.resizeTo(501, 1000)
			setTimeout(() => {
				resolve()
			}, 10)
		})

		expect(onResizePass).not.toBeCalled()
		expect(onResizeFail).not.toBeCalled()
	})
})
