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
}
