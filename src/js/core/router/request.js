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
			log('are we here')
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

				if (ok) {
					// return the response transform
					// i.e. for html response.html(), or json: response.json()
					return response[type]()
				}

				// things are not so good....
				log('SHIT')
				// object to hold all that went wrong
				const resp = {
					data: false,
					ok,
					status,
					url
				}
				// set the failed failed shiz into the cache ??? why... [RETHINk] ?

				// bail..
				throw new Error('Network response was not ok.')
			})
			.catch(err => {
				log('SHIT')
				reject(err)
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
