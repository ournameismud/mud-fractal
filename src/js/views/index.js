const exampleTransition = {
	onExit: ({ next, from: { route: { path } }, ...rest }) => {
		console.info('onExit', path, rest)
		next()
	},

	onAfterExit: ({ from: { route: { path } }, ...rest }) => {
		console.info('onAfterExit', path, rest)
	},

	onEnter: ({ next, to: { route: { path } }, ...rest }) => {
		console.info('onEnter', path, rest)
		next()
	},

	onAfterEnter: ({ to: { route: { path } }, ...rest }) => {
		console.info('onAfterEnter', path, rest)
	}
}
let prevHtml
const paginationExample = {
	updateDom({ wrapper, newHtml, title, action, from, to }) {
		if (from.route.pagination || to.route.pagination) {
			const { page: fromPageNumber } = from
			const { page: toPageNumber } = to

			if (toPageNumber > fromPageNumber) {
				log('GO FORWARD')
				wrapper.appendChild(newHtml)
				prevHtml = newHtml
			} else {
				log('GO BACKWARD')
				if (prevHtml) {
					let removeHtml = prevHtml
					const prev = removeHtml.previousElementSibling

					if (prev && prevHtml) {
						log('a')
						prevHtml = prev.classList.contains('page-child') ? prev : null
						removeHtml.parentNode.removeChild(removeHtml)
					} else {
						log('b')
						wrapper.parentNode.insertBefore(newHtml, wrapper)
					}
				}
			}
		} else {
			wrapper.appendChild(newHtml)
		}

		document.title = title
	},

	onExit: ({ next }) => {
		next()
	},

	onEnter: ({ next }) => {
		next()
	}
}

export default [
	{
		path: '/',
		view: exampleTransition
	},
	{
		path: '/blog/',
		view: exampleTransition,
		children: {
			path: ':id',
			view: paginationExample,
			pagination: true
		}
	},
	{
		path: '/page-2/',
		view: exampleTransition
	},
	{
		path: '/page-3/',
		view: exampleTransition
	},
	{
		path: '/page-4/',
		view: exampleTransition
	},
	{
		path: '*',
		view: exampleTransition
	}
]
