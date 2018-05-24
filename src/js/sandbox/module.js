const cache = (() => {
	const cache = {}

	return {
		set(key, value) {
			cache[key] = value
		},

		get(key) {
			return cache[key]
		}
	}
})()

cache.set('terry', {
	key: 10
})

cache.get('terry') // ?
