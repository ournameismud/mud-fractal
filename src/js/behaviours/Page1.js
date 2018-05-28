import Behaviour from '@/core/Behaviour'

export default class Page1 extends Behaviour {
	mount = () => {
		log('mount: Page1')
	}

	unmount = () => {
		log('unmount: Page1')
	}
}
