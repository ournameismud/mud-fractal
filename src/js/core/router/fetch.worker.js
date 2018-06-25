/*
	Web Worker

	https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers

	pretty much the same thing as the fetch function....

	there is no reference to the cache so that is handled before the request takes place

*/

// eslint-disable-next-line no-restricted-globals
self.addEventListener(
	'message',
	e => {
		const { links } = e.data
		links.map(link =>
			new Promise((resolve, reject) => {
				fetch(link)
					.then(response => {
						const { ok, status, url } = response

						if (ok) {
							return response.text()
						}
						// eslint-disable-next-line prefer-promise-reject-errors
						reject({ ok, status, url })
						return false
					})
					.then((...args) => {
						if (args) {
							const data = args[0].data ? { ...args[0].data } : args[0]

							resolve()
							self.postMessage([{ key: link, data }]) // eslint-disable-line no-restricted-globals
						}
					})
			}).catch(() => ({
				key: link,
				data: false
			}))
		)

		// Promise.all(proms).then(data => {
		// 	self.postMessage(data) // eslint-disable-line no-restricted-globals
		// })
	},
	false
)
