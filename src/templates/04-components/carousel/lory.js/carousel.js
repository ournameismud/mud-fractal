import { lory } from 'lory.js'

export default $node => {
	lory($node, {
		enableMouseEvents: true,
		infinite: 6,
		slideSpeed: 1200
		// options going here
	})

	const $slides = [...$node.querySelectorAll('.js_slide')]

	const onChange = ({ detail: { index, nextSlide } }) => {
		log(index, nextSlide)

		$slides
			.filter(item => item.classList.contains('is-expanded'))
			.forEach(item => item.classList.remove('is-expanded'))
		$slides[nextSlide].classList.add('is-expanded')
	}

	$node.addEventListener('before.lory.slide', onChange)
}
