export const Blog = {
	onEnter({ from, to, next }) {
		document.body.style.backgroundColor = '#4ae'
		next()
	},

	onLeave({ from, to, next }) {
		next()
	}
}
