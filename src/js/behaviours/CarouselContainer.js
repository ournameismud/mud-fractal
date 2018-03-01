import Behaviour from '@/core'
import carousel from '~/carousel/lory.js/carousel'

export default class CarouselContainer extends Behaviour {
	constructor(el) {
		super(el)

		carousel(el)
	}
}
