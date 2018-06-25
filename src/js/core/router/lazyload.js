import * as R from 'ramda'
import Worker from './fetch.worker.js'
import cache from './cache'
import { preventClick } from './utils/links'
import { inview } from '@/core/modules/inview'

/** *
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

	const viewport = inview(document, {
		enter({ isIntersecting, target }) {
			if (isIntersecting) {
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
					R.map(R.prop('pathname'))
				)([target])

				if (links.length) worker.postMessage({ links })

				return true
			}
		}
	})

	// add listen to events...
	worker.addEventListener('message', ({ data }) => {
		// should probably check what i'm getting here
		// but... alpha... we're getting html responses

		data.forEach(({ key, data }) => {
			log(`fetched: ${key}`)
			if (data) {
				cache.set(key, { data })
			} else {
				if (!R.contains(key)(errorLinks)) {
					errorLinks.push(key)
				}
			}
		})
	})

	viewport.watch({
		selector: '[data-prefetch]'
	})

	return nodes => {
		const validLinks = R.filter(link => !preventClick({}, link.pathname))(nodes)

		viewport.destroy()

		viewport.watch({
			selector: validLinks
		})
	}
})()
