import { activeLinks, preventClick } from '@/core/router/utils/links'

document.body.innerHTML = `<div>
<a id="valid" href="/waffle/">Root</a>
<a id="external" href="http://www.otherdomain.com/path/">a</a>
<a id="download" download="" href="/some/download.pdf">a</a>
<a id="spon" class="no-spon" href="/some/ignoredlink">a</a>
<a id="blank" target="_blank" href="/some/ignoredlink">a</a>
<a id="hash" href="/some/ignoredlink#waffle">a</a>
<a class="root" class="root"  href="/">Root</a>
<a class="parent parent--a" href="/a/">Root</a>
<a class="parent parent--b" href="/a/b/c">Root</a>
<a class="parent parent--c" href="/a/c">Root</a>
<a class="item" href="/a/b/c/d/">Root</a>
</div>`

describe('prevent route link', () => {
	it('should be a function', () => {
		expect(preventClick).toBeInstanceOf(Function)
	})

	it('should return true when called on a valid link', () => {
		const $node = document.getElementById('valid')
		const result = preventClick({}, $node)

		expect(result).toBe(true)
	})

	it('should return undefined when called with an external link', () => {
		const $node = document.getElementById('external')
		const result = preventClick({}, $node)
		expect(result).toBe(undefined)
	})

	it('should return undefined when called with no arguments', () => {
		const result = preventClick()

		expect(result).toBe(undefined)
	})

	it('should return break the link functionality, right click should work', () => {
		const $node = document.querySelector('.parent--a')
		const which = preventClick({ which: 3 }, $node)
		const metaKey = preventClick({ metaKey: true }, $node)
		const ctrlKey = preventClick({ ctrlKey: true }, $node)
		const altKey = preventClick({ altKey: true }, $node)
		const shiftKey = preventClick({ shiftKey: true }, $node)
		expect(which).toBe(undefined)
		expect(ctrlKey).toBe(undefined)
		expect(metaKey).toBe(undefined)
		expect(altKey).toBe(undefined)
		expect(shiftKey).toBe(undefined)
	})

	it('should return undefined when called with a download link', () => {
		const $node = document.getElementById('download')
		const result = preventClick({}, $node)
		expect(result).toBe(undefined)
	})

	it('should return undefined when called with an ignore class link', () => {
		const $node = document.getElementById('spon')
		const result = preventClick({}, $node)
		expect(result).toBe(undefined)
	})

	it('should return undefined when called on a link with target="_blank"', () => {
		const $node = document.getElementById('blank')
		const result = preventClick({}, $node)
		expect(result).toBe(undefined)
	})

	it('should return undefined when called on a link with a hash', () => {
		const $node = document.getElementById('hash')
		const result = preventClick({}, $node)
		expect(result).toBe(undefined)
	})
})

describe('active links function', () => {
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
		links('/')

		const $root = document.querySelector('.root')

		expect($root.classList.contains('is-current')).toBe(true)
	})

	it('should apply the correct classes to all matching nodes', () => {
		links('/a/b/c/d')

		const $root = document.querySelector('.root')
		const $item1 = document.querySelector('.parent--a')
		const $item2 = document.querySelector('.parent--b')
		const $item3 = document.querySelector('.parent--c')
		const $page = document.querySelector('.item')

		expect($root.classList.contains('is-current-root')).toBe(false)
		expect($item1.classList.contains('is-current-root')).toBe(true)
		expect($item2.classList.contains('is-current-parent')).toBe(true)
		expect($item3.classList.contains('is-current-parent')).toBe(false)
		expect($page.classList.contains('is-current')).toBe(true)
	})
})
