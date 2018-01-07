import FontFaceObserver from 'fontfaceobserver'

export default () => {
	const $html = document.getElementsByTagName('html')[0]
	const bold = new FontFaceObserver('MessinaSerifWeb-Bold')
	const regular = new FontFaceObserver('MessinaSerifWeb-Regular')
	const italic = new FontFaceObserver('MessinaSerifWeb-RegularItalic')
	const sans = new FontFaceObserver('FS Albert Bold')

	//

	Promise.all([bold.load(), regular.load(), italic.load(), sans.load()])
		.then(() => $html.classList.add('fonts-loaded'))
		.catch(() => $html.classList.add('fonts-failed'))
}
