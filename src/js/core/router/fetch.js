import cache from '@/core/router/cache'

export default (pathname, options = {}, type = 'text') => {
	return new Promise((resolve, reject) => {
		if (cache.get(pathname)) {
			log('from cache')
			resolve(cache.get(pathname))
			return
		}

		fetch(pathname, options)
			.then(response => {
				const { ok, status, url } = response

				if (!ok || status !== 200) {
					const resp = {
						data: false,
						ok,
						status,
						url
					}

					cache.set(pathname, resp)
					reject(resp)
					return
				}

				return response[type]()
			})
			.then(data => {
				cache.set(pathname, {
					data
				})
				resolve(data)
			})
	})
}
