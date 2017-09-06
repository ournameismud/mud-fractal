import config from './teaser.config'
const { variants, title, selector } = config

export default variants.map(({name}) => {
	return {
		label: `${title.toLowerCase()}--${name}`,
		options: {
			selectors: [selector]
		}
	}
})