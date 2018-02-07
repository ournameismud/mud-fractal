import Behaviour from '@/core'
import SponDraw from 'spon-draw'
import resizer from 'spon-resize'

export default class MobileMenu extends Behaviour {
	mounted = () => {
		this.resizer = resizer()
		this.resizer.start()

		this.$logo = document.getElementById('logo-svg')

		this.nav = new SponDraw({
			openButton: '[data-menu-opener]',
			closeButton: '[data-menu-closer]',
			overlay: document.getElementById('site-menu'),
			contents: document.getElementById('site-menu-inner')
		})

		this.resizer.at('(min-width: 62em)', {
			match: () => {
				this.nav.destroy()
			},

			unmatch: () => {
				this.nav.init()
			}
		})
	}
}
