import loader from '@/core/loader'

describe('loader function', () => {
	document.body.innerHTML = `<div id="test">
                              <b data-behaviour="ModuleA"></b>
                              <div id="wrapper">
                                <b class="fake" data-behaviour="ModuleB"></b>
                              </div>
                            </div>`

	let load

	beforeAll(() => {
		load = loader({}, `${__dirname}/behaviour/`)
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

		expect(stack[0].fn).toBeInstanceOf(Function)
		expect(stack[1].fn).toBeInstanceOf(Function)

		expect(node.classList.contains('test-class')).toBe(true)
	})
})
