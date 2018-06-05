import * as R from 'ramda'
import Worker from '@/core/router/fetch.worker.js'
import cache from '@/core/router/cache'
import { preventClick } from '@/core/router/utils/links'
import { beautifyPath } from '@/core/utils/strings'

/***
 * lazyload/prefetch items on a webworker...
 *
 * returns a function which when called requests urls and adds them to the cache
 *
 * @param :array[nodeList]
 *
 * @return :function
 *
 */

export default (() => {
	// setup a worker
	const worker = new Worker()
	// setup an array to store
	const errorLinks = []

	// add listen to events...
	worker.addEventListener('message', function({ data }) {
		// should probably check what i'm getting here
		// but... alpha... we're getting html responses

		data.forEach(({ key, data }) => {
			if (data) {
				cache.set(key, { data })
			} else {
				if (!R.contains(key)(errorLinks)) {
					errorLinks.push(key)
				}
			}
		})
	})

	return nodes => {
		// get the vailid links
		const links = R.compose(
			// reject error items
			R.reject(key => R.contains(key)(errorLinks)),
			// ignore any that are in the cache
			R.filter(
				pathname =>
					pathname !== window.location.pathname && !cache.get(pathname)
			),
			// just get the unique paths
			R.uniqBy(value => value),
			// grab the pathname
			R.map(R.prop('pathname')),
			// check for linkyness
			R.filter(link => !preventClick({}, link.pathname))
		)(nodes)

		links.length && worker.postMessage({ links })
	}
})()
