export const transitions = [
	{
		namespace: 'Homepage',
		transition: {
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
	},
	{
		path: '/b',
		transition: {
			start: function () {
				log('start About', this)
				this.newContainerLoading.then(() => this.done())
			},

			done: function () {
				log('end About')
				this.oldContainer.parentNode.removeChild(this.oldContainer)
				this.newContainer.style.visibility = 'visible'
				this.deferred.resolve()
			}
		}
	}
]