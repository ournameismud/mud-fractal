export const Fallback = {
	onEnter({ from, to, next }) {
		document.body.style.backgroundColor = '#5ea'
		// log('onEnter:Fallback')
		next()
	},

	onAfterEnter({ from, to }) {
		// log('onAfterEnter:Fallback')
	},

	onLeave({ from, to, next }) {
		// log('onLeave:Fallback')
		next()
	},

	onAfterLeave({ from, to }) {
		// log('onAfterLeave:Fallback')
	}
}
