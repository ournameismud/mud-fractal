import cache from './cache'

/**
 * @memberof RouterUtils
 * @function request
 *
 * @property {String} pathname - pathname to fetch
 * @property {Object} options - options to be used by fetch
 * @property {String} type - the type of response
 * @return {Promise}
 */

export default (
	pathname,
	options = {
		headers: {
			'X-SPONJS-ROUTE': 'true'
		}
	},
	type = 'text'
) =>
	new Promise(resolve => {
		// are we in the cache... yeah... get me and return
		if (cache.get(pathname)) {
			resolve(cache.get(pathname))
			return
		}

		// no cache... lets fetch it

		/** *
		 * native fetch
		 *
		 * @param {String} - the pathname
		 * @param {Object} - any fetch options
		 *
		 * @return :promise
		 */
		fetch(pathname, options)
			.then(response => {
				const { ok, status, url } = response

				if (ok) {
					// return the response transform
					// i.e. for html response.html(), or json: response.json()
					return response[type]()
				}

				// things are not so good....
				// object to hold all that went wrong
				const resp = {
					data: false,
					ok,
					status,
					url
				}
				return resp
			})
			.then(data => {
				// we have the goodies
				// add it to the cache

				if (!data.data) {
					cache.set(pathname, {
						data
					})
				}
				// we are done here... pass the response on
				resolve(data)
			})
	})
