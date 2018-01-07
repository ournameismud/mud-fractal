export const Post = {
	onEnter({ from, to, next }) {
		document.body.style.backgroundColor = '#ea4'
		next()
	},

	onLeave({ from, to, next }) {
		next()
	}
}
