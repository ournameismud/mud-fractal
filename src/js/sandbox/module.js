import * as R from 'ramda'

const log = R.curry((name, message) => {
	console.log(name, message)
	return message
})

let mix = superclass => new MixinBuilder(superclass)

class MixinBuilder {
	constructor(superclass) {
		this.superclass = superclass
	}

	with(...mixins) {
		return mixins.reduce((c, mixin) => mixin(c), this.superclass)
	}
}

let Mixin1 = superclass =>
	class extends superclass {
		init() {
			this.someProp = 10

			console.log(this.events)

			console.log('foo from Mixin1')
			if (super.init) super.init()
		}
	}

class Behaviour {
	constructor() {
		console.log('Behaviour:constructor')
	}

	init() {
		console.log('Behaviour:init')
	}
}

class Barry extends mix(Behaviour).with(Mixin1) {
	events = {
		hello: 'hugh'
	}

	mount() {
		console.log(this)
	}
}

const a = new Barry()

a.init()

a.mount()
