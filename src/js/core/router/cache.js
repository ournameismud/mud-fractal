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

export default cache
