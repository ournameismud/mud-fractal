const testElement = document.createElement('div')

const prefix = (function () {
	const styles = window.getComputedStyle(document.documentElement, '')
	const pre = (Array.prototype.slice
		.call(styles)
		.join('')
		.match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
	)[1]
	const dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1]
	return {
		dom: dom,
		lowercase: pre,
		css: '-' + pre + '-',
		js: pre[0].toUpperCase() + pre.substr(1)
	}
})()

export const transitionEnd = (function(){
	const transEndEventNames = {
		WebkitTransition : 'webkitTransitionEnd',
		MozTransition    : 'transitionend',
		OTransition      : 'oTransitionEnd otransitionend',
		transition       : 'transitionend'
	}
	for (let name in transEndEventNames) {
		if (testElement.style[name] !== undefined) {
			return transEndEventNames[name]
		}
	}
	return false
})()

/**
 * Return the prefix css3 property
 * @param {prop} prop - the un prefix css property (camelCase)
 * @return {String} the css3 property
 */
export function css3(prop) {
	function capitalize(str) {
		return str.charAt(0).toUpperCase() + str.slice(1)
	}
	const prefixed = prefix.css + capitalize(prop)
	const test = [prop, prefixed]
	for(let i = 0; i < test.length; i += 1) {
		if(testElement && testElement.style[test[i]] !== undefined) {
			return test[i]
		}
	}
	return false
}


/**
 * Returns the first matched parent node
 *
 * @memberOf utils/dom
 * @param  {HTMLElement} element, the target element
 * @param {String} selector, the selector to match against
 * @param {stopSelector} stopSelector, a selector to stop traversal
 * @return {HTMLElement}
 */
export function DomClosest(element, selector, stopSelector = 'body') {
	let parent = null
	while(element) {
		if(element.matches(selector)) {
			parent = element
			break
		} else if(stopSelector && element.matches(stopSelector)) {
			break
		}
		element = element.parentElement
	}
	return parent
}

/**
 * Returns an array of sibling elements
 *
 * @memberOf utils/dom
 * @param  {HTMLElement} the target element
 * @return {Array} Array of dom nodes
 */
export function DomSiblings(element) {
	return [...element.parentNode.children].filter(child => child !== element)
}



/**
 * Applies an object of css properties to the given dom node
 *
 * @memberOf utils/dom
 * @param  {String} element - the dom node to apply style to
 * @param {Object} properties - the css properties to apply
 * @return {Void}
 */
export function DomCss(element, properties) {
	function camelCase(str) {
		return str.replace(/-([a-z])/g, function($0, $1) { return $1.toUpperCase() }).replace('-','')
	}
	for (let property in properties) {
		if (properties.hasOwnProperty(property)) {
			element.style[css3(camelCase(property))] = properties[property]
		}
	}
}

/**
 * Simple wrapper around the classList method
 *
 * @memberOf utils/dom
 * @param  {HTMLElement} element | string
 * @param {HTMLElement} context
 * @return classList method
 */
export function DomClass(element, context = document) {
	const node = typeof element === 'string' ? context.querySelector(element) : element	
	return node.classList
}



/**
 * Remove the parents of an element from the DOM, leaving the element's content in place
 *
 * @memberOf utils/dom
 * @param  {HTMLElement} element | select element to unwrap
 * @return void
 */
export function DomUnwrap(element) {// 
	// get the element's parent node
	const parent = element.parentNode
	// move all children out of the element
	while (element.firstChild) parent.insertBefore(element.firstChild, element)
	// remove the empty element
	parent.removeChild(element)
}



/**
 * Remove the parents of an element from the DOM, leaving the element's content in place
 *
 * @memberOf utils/dom
 * @param  {HTMLElement} element | select element to wrap
 * @param  {HTMLElement} wrapper | a new html element
 * @return void
 */
export function DomWrap(element, wrapper) {// 
	element.parentNode.insertBefore(wrapper, element)
	return wrapper.appendChild(element)
}




/**
 * The following helper function insertAfter() lets you insert a new element after an existing one in the DOM tree:
 *
 * @memberOf utils/dom
 * @param  {HTMLElement} or {String} element | The element/html string to insert
 * @param  {HTMLElement} target | The reference element
 * @return void
 */
export function DomInsertAfter(element, target) {
	const method = typeof element === 'string' ? 'insertAdjacentHTML' : 'insertBefore'
	return target.parentNode[method](element, target.nextSibling)
}

/**
 * To insert an element before another one, we can use a very similar helper function: insertBefore()
 *
 * @memberOf utils/dom
 * @param  {HTMLElement} or {String} element | The element/html string to insert
 * @param  {HTMLElement} target | The reference element
 * @return void
 */
export function DomInsertBefore(element, target) {
	const method = typeof element === 'string' ? 'insertAdjacentHTML' : 'insertBefore'
	return target.parentNode[method](element, target)
}

/**
 * Append an element into a container
 *
 * @memberOf utils/dom
 * @param  {HTMLElement} element | The element to append
 * @param  {HTMLElement} parent | The reference element
 * @return void
 */
export function DomAppend(element, parent) {
	const fragment = document.createDocumentFragment()
	fragment.appendChild(element)
	parent.appendChild(fragment)
}


/**
 * Prepend an element into a container
 *
 * @memberOf utils/dom
 * @param  {HTMLElement} element | The element to prepend
 * @param  {HTMLElement} parent | The reference element
 * @return void
 */
export function DomPrepend(element, parent) {
	const fragment = document.createDocumentFragment()
	fragment.appendChild(element)
	parent.insertBefore(fragment, parent.childNodes[0])
}


/**
 * Use the createElement() method for creating a DOM element:
 *
 * @memberOf utils/dom
 * @param  {String} element | The element/html string to insert
 * @param  {HTMLElement} parent | The reference element
 * @return void
 */
export function DomCreate(tag, content) {
	const element = document.createElement(tag)
	if(content) element.innerHTML = content
	return element
}
