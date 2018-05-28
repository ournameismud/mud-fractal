import inview from '@/core/modules/inview'

describe('inview function', () => {
	document.body.innerHTML = `<div id="test">
                              <div id="wrapper" style="height: 400px; position: absolute; top: 0">
                                <b class="fake" data-behaviour="ModuleB"></b>
                              </div>
                            </div>`

	let view
	const $root = document.getElementById('wrapper')

	beforeAll(async done => {
		view = inview(
			$root,
			{
				enter: () => {
					$root.classList.add('enter')
				},
				exit: () => {
					$root.classList.add('exit')
				}
			},
			{}
		)
		window.scrollTo(0, 0)
		window.resizeTo(500, 1000)
		setTimeout(() => {
			done()
		}, 10)
	})

	it('should be a function', () => {
		expect(inview).toBeInstanceOf(Function)
	})

	it('should return 1 method [destroy]', () => {
		// this test is failing
		expect(view.destroy).toBeInstanceOf(Function)
	})

	// it('should call the enter event when the node is within the viewport', () => {
	// 	expect($root.classList.contains('enter')).toBe(true)
	// })
})
