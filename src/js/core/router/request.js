import cache from '@/core/router/cache'

/***
 * request function... ajax or cache
 *
 * @param :string - the pathname
 * @param :object - any fetch options
 * @param :string - the type of response transofmr
 *
 * @return :promise
 */

export default (pathname, options = {}, type = 'text') => {
	return new Promise((resolve, reject) => {
		// are we in the cache... yeah... get me and return
		if (cache.get(pathname)) {
			// log('from cache')
			// pass the response object back...
			// cos.. yeah... might want it
			resolve(cache.get(pathname))
			return
		}

		// no cache... lets fetch it

		/***
		 * native fetch
		 *
		 * @param :string - the pathname
		 * @param :object - any fetch options
		 *
		 * @return :promise
		 */
		fetch(pathname, options)
			.then(response => {
				const { ok, status, url } = response

				// things are not so good....
				if (!ok || status !== 200) {
					// object to hold all that went wrong
					const resp = {
						data: false,
						ok,
						status,
						url
					}
					// set the failed failed shiz into the cache ??? why... [RETHINk] ?
					cache.set(pathname, resp)
					// reject.. with out fancy error object
					reject(resp)

					// bail..
					return
				}

				// return the response transform
				// i.e. for html response.html(), or json: response.json()
				return response[type]()
			})
			.then(data => {
				// we have the goodies
				// add it to the cache
				cache.set(pathname, {
					data
				})
				// we are done here... pass the response on
				resolve(data)
			})
	})
}
