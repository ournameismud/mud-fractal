import Behaviour from '@/core/Behaviour'

export default class Page2 extends Behaviour {
	mount = () => {
		log('mount: Page2 Example Behaviour')
	}

	unmount = () => {
		log('unmount: Page2 Example Behaviour')
	}
}
