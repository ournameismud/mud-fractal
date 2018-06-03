import { parseUrl } from '@/core/router/utils/parseUrl'
import { findRoute } from '@/core/router/utils/paths'

describe('parseUrl function', () => {
	it('should be a function', () => {
		expect(parseUrl).toBeInstanceOf(Function)
	})

	it('should return an object', () => {
		expect(parseUrl('/test')).toBeInstanceOf(Object)
	})

	it('should return an object with all of the parts of a url', () => {
		const string = '/blog/p10/?category=hugh#barry'
		const expected = {
			isRoot: false,
			hash: 'barry',
			host: '',
			path: '/blog/p10/',
			segments: ['blog', 'p10'],
			slug: 'p10',
			source: '/blog/p10/?category=hugh#barry',
			query: { category: 'hugh' },
			length: 2
		}

		const result = parseUrl(string)

		expect(result).toMatchObject(expected)
	})
})

describe('findRoute function', () => {
	const routes = [
		{
			path: '/',
			name: 'root',
			view: {},
			options: {}
		},
		{
			path: '/a/',
			name: 'a',
			view: {},
			options: {},
			children: [
				{
					path: /(p)+(\d+)/,
					view: {},
					options: {},
					name: 'pagination'
				},
				{
					path: ':id',
					name: 'dynamic',
					view: {},
					options: {}
				},
				{
					path: '/terry/',
					name: 'terry',
					view: {},
					options: {},
					children: {
						path: ':id',
						name: 'terry:id',
						view: {},
						options: {}
					}
				}
			]
		},
		{
			path: '*',
			name: 'c-wendual',
			view: {},
			options: {}
		}
	]

	let find

	beforeAll(() => {
		find = findRoute(routes)
	})

	it('should be a function', () => {
		expect(findRoute).toBeInstanceOf(Function)
		expect(find).toBeInstanceOf(Function)
	})

	it('should match the root page', () => {
		const props = {
			path: '/',
			name: 'root'
		}

		expect(find('/')).toMatchObject(props)
	})

	it('should match the a single level path', () => {
		const props = {
			name: 'a'
		}

		expect(find('/a/')).toMatchObject(props)
	})

	it('should match the a deeper level path', () => {
		const props = {
			name: 'terry'
		}

		expect(find('/a/terry/')).toMatchObject(props)
	})

	it('should match the a dynamic path', () => {
		const props = {
			name: 'dynamic'
		}

		expect(find('/a/:id/')).toMatchObject(props)
	})

	it('should match the a regex path', () => {
		const props = {
			name: 'pagination'
		}

		expect(find('/a/p2/')).toMatchObject(props)
	})
})
