import Behaviour from '@/core/behaviour'

class Example extends Behaviour {
	constructor(el) {
		super(el)
		this.$events = this.$events(this.events)
		this.$events.attachAll()
	}

	events = {
		'click [data-item]': 'funk'
	}

	funk = (e, elm) => {
		e.preventDefault()
		this.$refs.mod1.node.classList.add('cheese')
	}
}

export default node => {
	const thing = new Example(node)

	return () => {
		thing.destroy()
	}
}
