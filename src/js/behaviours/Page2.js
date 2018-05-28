import Behaviour from '@/core/Behaviour'

export default class Page2 extends Behaviour {
	mount = () => {
		log('mount: Page2')
	}

	unmount = () => {
		log('unmount: Page2')
	}
}
