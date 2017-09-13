import WebFont from 'webfontloader'
import Behaviour from '@/core'

export default class WebFontLoader extends Behaviour {
	constructor() {
		super()

		WebFont.load({
			custom: {
				typekit: {
					id: 'wwe2tnw'
				},
				custom: {
					families: [
						'apercu-mono',
						'FoundersGroteskCondensedWeb-Bold',
						'FoundersGroteskCondensedWeb-Light',
						'FoundersGroteskCondensedWeb-Semibold'
					],
					urls: ['/dist/css/fonts.css']
				}
			},

			active: () => {
				this.listener.trigger('fonts:loaded')
			}
		})
	}
}
