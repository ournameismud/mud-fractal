export default {
	el: '.page-child',

	onLoad: props => {
		console.info('onLoad', props)
	},

	onError: props => {
		console.warn('error loading page', props)
	},

	updateDom: ({ wrapper, newHtml, title }) => {
		wrapper.innerHTML = ''
		wrapper.appendChild(newHtml)
		document.title = title
	},

	onExit: ({ next, action, from, to }) => {
		log(from)
		const debug = {
			from: from.data.path,
			to: to.data.path,
			action
		}

		console.table(debug)

		next()
	},

	onAfterExit: () => {},

	onEnter: ({ next }) => {
		next()
	},

	onAfterEnter: () => {}
}
