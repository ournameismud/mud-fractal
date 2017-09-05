export const Base = {
	start: function () {
		log('start Base', this)
		this.newContainerLoading.then(() => this.done())
	},

	done: function () {
		log('end Base')
		this.oldContainer.parentNode.removeChild(this.oldContainer)
		this.newContainer.style.visibility = 'visible'
		this.deferred.resolve()
	}
}