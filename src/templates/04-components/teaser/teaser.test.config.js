import config from './teaser.config'
const { variants, title, selector, status } = config

export default variants.map(({name}) => {
	return {
		status: status,
		label: `${title.toLowerCase()}--${name}`,
		options: {
			selectors: [selector]
		}
	}
})
