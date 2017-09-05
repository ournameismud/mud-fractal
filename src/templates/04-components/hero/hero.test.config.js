import config from './hero.config'

const path = 'http://localhost:3000/components/preview/'
const title = config.title.toLowerCase()
const output = config.variants.map((entry) => {
	return {
		label: `${title}--${entry.name}`,
		url: `${path}${title}--${entry.name}.html`,
		selectors: [
			`${entry.selector}`
		],
		selectorExpansion: true,
		hideSelectors: [],
		removeSelectors: [],
		readyEvent: null,
		delay: 500,
		misMatchThreshold: 0.2,
		requireSameDimensions: true
	}
})

export default output