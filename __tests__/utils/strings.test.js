import * as str from '@/core/utils/strings'

describe('fetch function', () => {
	it('slug/camel/snakeify should all be functons', () => {
		expect(str.camelify).toBeInstanceOf(Function)
		expect(str.slugify).toBeInstanceOf(Function)
		expect(str.snakeify).toBeInstanceOf(Function)
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
})
