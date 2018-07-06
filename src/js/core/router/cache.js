import { leadingSlashPath } from '@/core/utils/strings'

/**
 * @typedef {Object} Cache
 * @property {function} set Set an items into cache
 * @property {String} set.key Name of the item to cache
 * @property {Object} set.value Value of the item to cache
 * @property {function} get Get an item from the cache
 * @property {String} get.key Name of the item to get
 */

/**
 * @memberof RouterUtils
 * @function cache
 * @return {Cache}
 */
const cache = (() => {
	const cache = {}

	return {
		set(key, value) {
			cache[leadingSlashPath(key)] = value
		},

		get(key) {
			return cache[leadingSlashPath(key)]
		}
	}
})()

export default cache
