import Loader from '../../src/js/core/loader'

test('Loader: when called it creates an instance of Loader ', () => {
	expect(new Loader()).toBeInstanceOf(Loader)
})

test('Loader: the inherited concert functions are available ', () => {
	const a = new Loader()
	expect(a.on).toBeInstanceOf(Function)
	expect(a.once).toBeInstanceOf(Function)
	expect(a.off).toBeInstanceOf(Function)
	expect(a.trigger).toBeInstanceOf(Function)
})
