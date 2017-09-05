export const Homepage = {
	start: function () {
		log('start Homepage', this)
		this.newContainerLoading.then(() => this.done())
	},

	done: function () {
		log('end Homepage')
		this.oldContainer.parentNode.removeChild(this.oldContainer)
		this.newContainer.style.visibility = 'visible'
		this.deferred.resolve()
	}
}