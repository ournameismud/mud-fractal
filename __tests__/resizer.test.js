import resizer from '@/core/modules/resizer'

describe('resize function', () => {
	beforeEach(async done => {
		window.resizeTo(500, 500)
		setTimeout(() => {
			done()
		}, 10)
	})

	afterEach(async done => {
		window.resizeTo(500, 500)
		setTimeout(() => {
			done()
		}, 10)
	})

	it('should be a function', () => {
		expect(resizer).toBeInstanceOf(Function)
	})

	it('should find the current width and height', () => {
		const r = resizer()
		const { width, height } = r
		expect(width).toBe(500)
		expect(height).toBe(500)

		r.destroy()
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

		r.destroy()
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

		r.destroy()
		expect(r.width).toBe(79)
		expect(r.height).toBe(1000)
	})

	it('should trigger events based on the events object passed', async () => {
		let l
		let f
		global.innerWidth = 600
		const onResizePass = jest.fn(({ match }) => (l = match))
		const onResizeFail = jest.fn(({ match }) => {
			if (match) {
				f = true
			}
		})
		const r = resizer({
			'(min-width: 600px)': onResizePass,
			'(min-width: 2200px)': onResizeFail
		})

		await new Promise(resolve => {
			window.resizeTo(700, 1000)
			setTimeout(() => {
				resolve()
			}, 10)
		})

		r.destroy()

		expect(onResizePass).toBeCalled()
		expect(l).toBe(true)
		expect(f).toBe(undefined)
	})

	it('should remove all of the events when calling the destroy method', () => {
		let l = 0
		const onResizePass = jest.fn(({ match }) => {
			if (match) {
				l += 1
			}
		})
		const r = resizer({
			'(min-width: 700px)': onResizePass
		})

		r.destroy()

		expect(onResizePass).not.toBeCalled()
	})
})
