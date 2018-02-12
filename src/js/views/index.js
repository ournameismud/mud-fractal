const example = {
	onEnter({ wrapper, next }) {
		wrapper.style.opacity = 1
		next()
	},

	onEnterComplete() {},

	onLeave({ wrapper, next }) {
		wrapper.style.opacity = 0
		next()
	},

	onLeaveComplete() {}
}

export default [
	{
		path: '/',
		view: example
	},
	{
		path: '*',
		view: example
	}
]
