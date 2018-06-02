import * as R from 'ramda'

export const removeSpecialCharacters = R.compose(
	R.trim,
	R.replace(/\s+/g, ' '),
	R.replace(/[^a-zA-Z\d\s:]/g, '')
)

const lens = R.over(R.lensIndex(0))

export const pascalify = R.memoizeWith(R.identity, str => {
	return R.compose(
		R.join(''),
		lens(R.toUpper),
		R.replace(/[\s]+(.)?/g, (match, ch) => (ch ? R.toUpper(ch) : '')),
		R.toLower,
		removeSpecialCharacters
	)(str)
})

export const camelify = R.memoizeWith(R.identity, str => {
	return R.compose(
		R.replace(/[\s]+(.)?/g, (match, ch) => (ch ? R.toUpper(ch) : '')),
		R.toLower,
		removeSpecialCharacters
	)(str)
})

export const slugify = R.memoizeWith(R.identity, str => {
	return R.compose(
		R.replace(/[\s]+(.)?/g, (match, ch) => (ch ? `-${R.toLower(ch)}` : '')),
		R.toLower,
		removeSpecialCharacters
	)(str)
})

export const snakeify = R.memoizeWith(R.identity, str => {
	return R.compose(
		R.replace(/[\s]+(.)?/g, (match, ch) => (ch ? `_${R.toLower(ch)}` : '')),
		R.toLower,
		removeSpecialCharacters
	)(str)
})
