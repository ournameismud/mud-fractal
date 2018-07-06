import { parseUrl } from '@/core/router/utils/parseUrl'

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
			path: 'blog/p10',
			segments: ['blog', 'p10'],
			slug: 'p10',
			source: '/blog/p10/?category=hugh#barry',
			query: { category: 'hugh' }
		}

		const result = parseUrl(string)

		expect(result).toMatchObject(expected)
	})
})
