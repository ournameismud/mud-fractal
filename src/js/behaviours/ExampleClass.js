import Behaviour from '@/core/behaviour'

export default class ExampleClass extends Behaviour {
	mount = () => {
		this.$el.classList.add('mount')
		this.$events.attachAll()

		this.$screen.on('window:resize', ({ width, height, query }) => {
			log({ width, height, query })
		})
	}

	unmount = () => {
		this.$el.classList.add('unmount')
	}

	events = {
		'click [data-link]': 'onClick'
	}

	onClick = (e, elm) => {
		e.preventDefault()
		elm.classList.toggle('huzzah')
	}

	routes = {
		enter: () => {
			this.$el.classList.toggle('enter')
		},
		exit: () => {
			this.$el.classList.toggle('exit')
		}
	}

	screens = {
		'(min-width: 1024px)': ({ match, width, height, query }) => {
			log('(min-width: 1024px)', match, width, height, query)
		},
		'(min-width: 680px)': ({ match, width, height, query }) => {
			log('(min-width: 680px)', match, width, height, query)
		}
	}
}
