export const Page1 = {
	onEnter({ from, to, next }) {
		document.body.style.backgroundColor = '#7fa'
		next()
	},

	onLeave({ from, to, next }) {
		next()
	}
}
