export default {
	el: '.page-child',

	onLoad: props => {
		log('on load')
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

	onExit: ({ next }) => {
		next()
	},

	onAfterExit: () => {},

	onEnter: ({ next }) => {
		next()
	},

	onAfterEnter: () => {}
}
