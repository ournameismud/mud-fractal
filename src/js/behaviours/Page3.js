import Behaviour from '@/core/Behaviour'

export default class Page3 extends Behaviour {
	mount = () => {
		log('mount: Page3')
	}

	unmount = () => {
		log('unmount: Page3')
	}
}
