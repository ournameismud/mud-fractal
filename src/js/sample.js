import mitt from 'mitt'

export default class Example {
	constructor() {
		this.value = 10

		Object.assign(this, mitt())

		this.on('some:event', () => {
			this.value = 40
		})
	}

	addEvents = () => {
		const $node = document.getElementById('btn')
		$node.addEventListener('click', () => {
			$node.textContent = 'gary'
		})
	}
}
