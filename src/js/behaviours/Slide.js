import Behaviour from '@/core'
import SponSlide from 'spon-slide'

export default class Slide extends Behaviour {
	mounted = () => {
		this.slide = new SponSlide(this.$slide, {
			activeClass: 'c-lightbox__item--current'
		})

		this.slide.init()
	}
}
