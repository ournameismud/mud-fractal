export const Page3 = {
	onEnter({ from, to, next }) {
		document.body.style.backgroundColor = '#dda'
		next()
	},

	onLeave({ from, to, next }) {
		next()
	}
}
