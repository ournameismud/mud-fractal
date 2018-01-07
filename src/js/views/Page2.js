export const Page2 = {
	onEnter({ from, to, next }) {
		document.body.style.backgroundColor = '#e32'
		next()
	},

	onLeave({ from, to, next }) {
		next()
	}
}
