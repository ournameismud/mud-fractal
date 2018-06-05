import * as str from '@/core/utils/strings'

describe('fetch function', () => {
	it('removeSpecialCharacters and slug/camel/snakeify should all be functons', () => {
		expect(str.camelify).toBeInstanceOf(Function)
		expect(str.slugify).toBeInstanceOf(Function)
		expect(str.snakeify).toBeInstanceOf(Function)
		expect(str.segmentize).toBeInstanceOf(Function)
		expect(str.beautifyPath).toBeInstanceOf(Function)
		expect(str.slugFromPath).toBeInstanceOf(Function)
		expect(str.removeSpecialCharacters).toBeInstanceOf(Function)
	})

	it('should remove any special characters and trim strings', () => {
		expect(str.removeSpecialCharacters('hello _!@#$%^&*()   Hugh   ')).toBe(
			'hello Hugh'
		)
	})

	it('should covert strings to camelCase', () => {
		const result = 'helloHugh'
		expect(str.camelify('Hello Hugh')).toBe(result)
		expect(str.camelify('   Hello    Hugh   ')).toBe(result)
		expect(str.camelify('  --- Hello @#$%^&*   Hugh   ')).toBe(result)
	})

	it('should covert strings to slugs', () => {
		const result = 'hello-hugh'
		expect(str.slugify('Hello Hugh')).toBe(result)
		expect(str.slugify('  --- Hello @#$%^&*   Hugh   ')).toBe(result)
	})

	it('should covert strings to snakes', () => {
		const result = 'hello_hugh'
		expect(str.snakeify('Hello Hugh')).toBe(result)
		expect(str.snakeify('  --- Hello @#$%^&*   Hugh   ')).toBe(result)
	})

	it('should covert strings to pascal case', () => {
		const result = 'HelloHugh'
		expect(str.pascalify('hello Hugh')).toBe(result)
		expect(str.pascalify('  --- hello @#$%^&*   Hugh   ')).toBe(result)
	})

	it('segmentize should convert a url into segments', () => {
		const result = JSON.stringify(['hello', 'hugh'])
		expect(JSON.stringify(str.segmentize('/hello/hugh'))).toBe(result)
	})

	it('beautifyPath should strip a url of it\'s opening/closing slashes', () => {
		const result = 'hello/hugh'
		expect(str.beautifyPath('/hello/hugh/')).toBe(result)
	})

	it('it should beautify but with a leading slash', () => {
		const result = '/hello/hugh'
		expect(str.leadingSlashPath('/hello/hugh/')).toBe(result)
	})

	it('slugFromPath should return the page slug', () => {
		const result = 'hugh'
		expect(str.slugFromPath('/hello/hugh/')).toBe(result)
	})
})
