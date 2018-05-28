import Behaviour from '@/core/Behaviour'

export default class Page3 extends Behaviour {
	mount = () => {
		log('mount: Page3 Example Behaviour')
	}

	unmount = () => {
		log('unmount: Page3 Example Behaviour')
	}
}
