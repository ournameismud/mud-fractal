/***
 * Cache object
 *
 * @return :object
 */
const cache = (() => {
	/*
		The cache... html responses from ajax requests get stored here
		We should probably put a limit on it!
	*/
	const cache = {}

	return {
		/***
		 * set('string', value)
		 *
		 * set an item into the cache
		 *
		 * @param :string, :any
		 *
		 * @return void
		 */
		set(key, value) {
			cache[key] = value
		},

		/***
		 * get('string')
		 *
		 * set an item into the cache
		 *
		 * @param :string
		 *
		 * @return :any
		 */
		get(key) {
			return cache[key]
		}
	}
})()

export default cache
