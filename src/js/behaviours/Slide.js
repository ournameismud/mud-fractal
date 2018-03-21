// ({
// 	plugins: 'jsdom-quokka-plugin',
// 	jsdom: {
// 		html: `<div id="test">
// 						<ul>
// 							<li data-slide-item>11</li>
// 							<li data-slide-item>11</li>
// 							<li data-slide-item>11</li>
// 						</ul>
// 						<button data-slide-next />
// 					</div>`
// 	}
// })

import Behaviour from '@/core'
import SponSlide from 'spon-slide'

export default class Slide extends Behaviour {
	constructor(el) {
		super(el)

		this.slide = new SponSlide(this.$el)

		this.slide.init()
	}
}

// new Slide(document.getElementById('test'))
