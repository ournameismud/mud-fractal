import Behaviour from '@/core'
// https://github.com/magicspon/spon-expander
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
