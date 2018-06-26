import { leadingSlashPath } from '@/core/utils/strings'

/** *
 * Cache object
 *
 * @return {Object}
 */
const cache = (() => {
	/*
		The cache... html responses from ajax requests get stored here
		We should probably put a limit on it!

		keys are beautified, with a leading slash, before storing to unsure 
		prevent duplicate requests... probably a better way... hmm!
		does the job! 
	*/
	const cache = {}

	return {
		/** *
		 * set('string', value)
		 *
		 * the input is beautified, with a leading slash, before storing
		 *
		 * set an item into the cache
		 *
		 * @param {String}, :any
		 *
		 * @return {void}
		 */
		set(key, value) {
			cache[leadingSlashPath(key)] = value
		},

		/** *
		 * get('string')
		 *
		 * get an item from the cache
		 *
		 * the input is beautified, with a leading slash, before requesting
		 *
		 * @param {String}
		 *
		 * @return {Object}
		 */
		get(key) {
			return cache[leadingSlashPath(key)]
		}
	}
})()

export default cache
