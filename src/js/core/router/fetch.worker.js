self.addEventListener(
	'message',
	e => {
		const { links } = e.data
		const proms = links.map(link => {
			return new Promise(resolve => {
				fetch(link)
					.then(response => {
						const { ok, status, url } = response
						if (!ok || status !== 200) {
							return {
								data: false,
								ok,
								status,
								url
							}
						}

						return response.text()
					})
					.then((...args) => {
						const data = args[0].data ? { ...args[0].data } : args[0]

						resolve({ key: link, data })
					})
			})
		})

		Promise.all(proms).then(data => {
			self.postMessage(data)
		})
	},
	false
)
