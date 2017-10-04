import Behaviour from '@/core'
import Tabs from '@/ui/tabs'

/**
 *
 * @extends Behaviour
 * @class MobileMenu
 */
export class TabPanel extends Behaviour {
	/**
	 * @function constructor
	 * @param  {HTMLElement} el | the html element the behaviour is mounted on
	 * @return MobileMenu
	 */
	constructor(el) {
		super(el)
		new Tabs(el)
	}
}
