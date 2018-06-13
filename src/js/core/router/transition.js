export default {
	el: '.page-child',

	onLoad(props) {
		console.info('onLoad', props) // eslint-disable-line no-console
	},

	shouldUnmount() {
		return true
	},

	shouldMount() {
		return true
	},

	onError: props => {
		console.warn('error loading page', props) // eslint-disable-line no-console
	},

	updateDom({ wrapper, newHtml, title }) {
		wrapper.innerHTML = '' // eslint-disable-line no-param-reassign
		wrapper.appendChild(newHtml)
		document.title = title
	},

	onExit({ next }) {
		// console.table({ from: from.data.path, to: to.data.path, action }) // eslint-disable-line
		next()
	},

	onAfterExit() {},

	onEnter({ next }) {
		next()
	},

	onAfterEnter() {}
}
