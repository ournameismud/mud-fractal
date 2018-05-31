import Behaviour from '@/core/Behaviour'

export default class Page1 extends Behaviour {
	mount = () => {
		log(`mount: ${window.location.pathname} Example Behaviour`)
	}

	unmount = () => {
		log(`unmount: ${window.location.pathname} Example Behaviour`)
	}
}
