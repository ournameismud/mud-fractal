export default {
	el: '.page-child',

	onLoad: () => {
		log('on load')
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
