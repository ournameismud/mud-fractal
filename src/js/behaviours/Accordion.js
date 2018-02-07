import Behaviour from '@/core'
import SponExpander from 'spon-expander'

export default class Accordion extends Behaviour {
	mounted = () => {
		new SponExpander(this.$el, {
			init: true,
			closeOthers: true,
			activeIndex: 0
		})
	}
}
