import loader from '@/core/modules/loader'

describe('loader function', () => {
	document.body.innerHTML = `<div id="test">
                              <b data-behaviour="ModuleA"></b>
                              <div id="page-wrapper">
                                <div data-behaviour="ModuleB"></div>
                              </div>
                            </div>`

	let load
	const fn = behaviour => import(`../behaviours/${behaviour}`)
	beforeAll(() => {
		load = loader(fn)
	})

	it('should be a function', () => {
		expect(loader).toBeInstanceOf(Function)
	})

	it('should return 2 methods [hydrate, unmount]', () => {
		expect(load.hydrate).toBeInstanceOf(Function)
		expect(load.unmount).toBeInstanceOf(Function)
	})

	it('should load the behaviours', async () => {
		const data = await load.hydrate(document)

		const { stack, scope } = data

		const node = document.querySelector('[data-behaviour="ModuleA"]')

		expect(stack.length).toEqual(2)
		expect(scope.length).toEqual(1)

		expect(stack[0].id).toEqual('ModuleA')
		expect(stack[1].id).toEqual('ModuleB')

		expect(stack[0].fn.$el).toEqual(node)

		expect(stack[0].fn.constructor).toBeInstanceOf(Function)
		expect(stack[1].fn.constructor).toBeInstanceOf(Function)

		// expect(node.classList.contains('test-class')).toBe(true)
	})
})
