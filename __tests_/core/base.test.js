import Base from '../../src/js/core'

test('Base: when called it creates an instance of Base ', () => {
	expect(new Base()).toBeInstanceOf(Base)
})

test('Base: the inherited concert functions are available ', () => {
	const a = new Base()
	expect(a.on).toBeInstanceOf(Function)
	expect(a.once).toBeInstanceOf(Function)
	expect(a.off).toBeInstanceOf(Function)
	expect(a.trigger).toBeInstanceOf(Function)
})

test('Base: has a unique id', () => {
	const a = new Base()
	const b = new Base()
	expect(a.cid).not.toBe(b.cid)
})