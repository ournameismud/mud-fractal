export default {
	el: '.page-child',

	updateDom: ({ wrapper, newHtml, title }) => {
		wrapper.innerHTML = ''
		wrapper.appendChild(newHtml)
		document.title = title
	},

	onExit: ({ next }) => {
		log('onExit')
		next()
	},

	onAfterExit: () => {
		log('onAfterExit')
	},

	onEnter: ({ next }) => {
		log('onEnter')
		next()
	},

	onAfterEnter: () => {
		log('onAfterEnter')
	}
}
