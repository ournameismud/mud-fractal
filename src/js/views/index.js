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
	updateDom({ wrapper, newHtml, title, action }) {
		if (action === 'POP' && prevHtml) {
			if (prevHtml) {
				let removeHtml = prevHtml
				const prev = removeHtml.previousElementSibling
				prevHtml = prev.classList.contains('page-child') ? prev : null
				removeHtml.parentNode.removeChild(removeHtml)
			}
		} else {
			wrapper.appendChild(newHtml)
			prevHtml = newHtml
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
		path: '/page-1/',
		view: exampleTransition,
		children: {
			path: ':id',
			view: paginationExample
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
