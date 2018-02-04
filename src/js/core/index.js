import { isFn, MixinBuilder } from './utils'

export { DomEvents } from './DomEvents'

export const mix = superclass => new MixinBuilder(superclass)

const $dom = {
	$html: document.getElementsByTagName('html')[0],
	$body: document.body
}

const KEY_CODES = {
	DELETE_KEY: 8,
	SHIFT_KEY: 16,
	CTRL_KEY: 17,
	ALT_KEY: 18,
	RETURN_KEY: 13,
	ESC_KEY: 27,
	SPACE_KEY: 32,
	LEFT_KEY: 37,
	UP_KEY: 38,
	RIGHT_KEY: 39,
	DOWN_KEY: 40,
	A_KEY: 65,
	S_KEY: 83,
	CMD_KEY: 91
}

export default class Behaviour {
	constructor($el = document, options = {}) {
		this.options = options

		this.$el = $el

		this.KEY_CODES = KEY_CODES

		Object.assign(this, $dom)

		return this
	}

	initialize = () => {
		setTimeout(() => this.mounted())

		return this
	}

	destroy = () => {
		if (isFn(this.unmount)) this.unmount()

		if (this.events) {
			this.removeDomEvents()
		}

		return this
	}

	mounted = () => {}

	unmount = () => {}
}
