/**
 * credit:
 *
 * https://github.com/luruke/barba.js/blob/master/src/Pjax/Pjax.js
 *
 */
export const preventClick = (evt, element) => {
	const { href } = element
	if (!element || !href) return false

	//Middle click, cmd click, and ctrl click
	if (evt.which > 1 || evt.metaKey || evt.ctrlKey || evt.shiftKey || evt.altKey)
		return

	//Ignore target with _blank target
	if (element.target && element.target === '_blank') return

	//Check if it's the same domain
	if (
		window.location.protocol !== element.protocol ||
		window.location.hostname !== element.hostname
	)
		return

	//Check if the port is the same

	//Ignore case when a hash is being tacked on the current URL
	if (href.indexOf('#') > -1) return

	//Ignore case where there is download attribute
	if (
		element.getAttribute &&
		typeof element.getAttribute('download') === 'string'
	)
		return

	if (element.classList.contains('nope')) return

	return true
}
