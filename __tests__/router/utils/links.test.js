import { activeLinks } from '@/core/router/utils/links'

describe('active links function', () => {
	document.body.innerHTML = `<div>
															<a class="root" href="/">Root</a>
															<a class="parent parent--a" href="/a/">Root</a>
															<a class="parent" href="/a/b/c">Root</a>
															<a class="item" href="/a/b/c/d/">Root</a>
														</div>`

	const defaultClasses = {
		match: 'is-current',
		root: 'is-current-root',
		parent: 'is-current-parent'
	}

	let links
	const nodes = [...document.querySelectorAll('a')]

	beforeAll(() => {
		links = activeLinks({ scope: nodes, classes: defaultClasses })
	})

	it('should be a function', () => {
		expect(activeLinks).toBeInstanceOf(Function)
	})

	it('should return a function', () => {
		expect(
			activeLinks({ scope: nodes, classes: defaultClasses })
		).toBeInstanceOf(Function)
	})

	it('should apply the is current class to the top level node when', () => {
		links('')

		const $root = document.querySelector('.root')

		expect($root.classList.contains('is-current')).toBe(true)
	})

	it('should apply the is the parent class to any parent nodes', () => {
		links('a/b/c/d')

		const $item = document.querySelector('.parent--a')

		expect($item.classList.contains('is-current-parent')).toBe(true)
	})
})
