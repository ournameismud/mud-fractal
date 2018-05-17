import Behaviour from '@/core/behaviour'

export default class Example extends Behaviour {
	events = {
		'click [data-item]': 'funk'
	}

	funk = (e, elm) => {
		e.preventDefault()
		this.$refs.mod1.node.classList.add('cheese')
	}
}
