export default {
	el: '.page-child',

	onLoad(props) {
		console.info('onLoad', props)
	},

	shouldUnmount() {
		return true
	},
	
	shouldMount() {
		return true
	},

	onError: props => {
		console.warn('error loading page', props)
	},

	updateDom({ wrapper, newHtml, title }) {
		wrapper.innerHTML = ''
		wrapper.appendChild(newHtml)
		document.title = title

		return true // return true to unmount previous html
	},

	onExit({ next, action, from, to }) {
		// console.table({ from: from.data.path, to: to.data.path, action }) // eslint-disable-line
		next()
	},

	onAfterExit() {},

	onEnter({ next }) {
		next()
	},

	onAfterEnter() {}
}
