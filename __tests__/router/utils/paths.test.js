import { findRoute, flattenRoutes } from '@/core/router/utils/paths'

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
		name: 'default',
		view: {},
		options: {}
	}
]

describe('flattenRoute function', () => {
	it('should be a function', () => {
		expect(flattenRoutes).toBeInstanceOf(Function)
	})

	it('should flatten the routes into a 1d array', () => {
		const flatRoutes = flattenRoutes(routes)

		expect(flatRoutes.length).toBe(7)

		expect(flatRoutes[0].path).toBe('')
		expect(flatRoutes[1].path).toBe('a')
		expect(flatRoutes[2].path).toBe('a/(p)+(\\d+)')
		expect(flatRoutes[3].path).toBe('a/:id')
		expect(flatRoutes[4].path).toBe('a/terry')
		expect(flatRoutes[5].path).toBe('a/terry/:id')
	})
})

describe('findRoute function', () => {
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
			name: 'pagination',
			pageNo: 2
		}

		expect(find('/a/p2/')).toMatchObject(props)
	})

	it('should fallback to the * default transition', () => {
		const props = {
			name: 'default'
		}

		expect(find('/dsadsadad/')).toMatchObject(props)
	})
})
