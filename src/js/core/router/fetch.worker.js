self.addEventListener(
	'message',
	e => {
		const { links } = e.data
		const proms = links.map(link => {
			return new Promise(resolve => {
				fetch(link)
					.then(response => response.text())
					.then(data => {
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
