import validate from 'validate.js'
import { createEvents } from '@/core/modules/createEvents'
import * as R from 'ramda'
import domify from 'domify'
import mitt from 'mitt'

/**
 * @namespace Validate
 * @class Validate
 * @description Handles form validation, and nothing else
 *
 * @example
 *
 * js:
 * const $form = document.querySelector('[data-form-delivery]')
 * const validator = new Validate($form, {
 * 	rules: {
 * 		email: {
 * 			presence: true,
 * 			email: true
 * 		},
 *
 * 		firstName: {
 * 			presence: true
 * 		},
 *
 * 		surname: {
 * 			presence: true
 * 		}
 * 	},
 * 	ajax: true
 * })
 *
 * validator.mount()
 *
 * validator.on('submit:success', ({ data }) => {
 * 	fetch(data, {
 * 		method: 'POST'
 * 	})
 * 	.then(response => response.json)
 * 	.then(data => {
 * 		// handle the response
 * 	})
 * })
 *
 * html:
 * <form>
 * 	<div class="flex-1" data-field-row="">
 * 		<label for="firstName">First Name*</label>
 * 		<input type="text" name="firstName" id="firstName" required>
 * 	</div>
 * 	<button type="submit">Submit</button>
 * </form>
 *
 * @param {HTMLElement} el - the form to validate
 * @param {Object} options - any form options
 * @property {Boolean} options.ajax - should prevent default be called when submitting the form
 * @property {Boolean} options.rules - form validation rules
 *
 */

export default class Validate {
	defaults = {
		ajax: true
	}

	constructor(el, options) {
		this.$el = el
		this.options = { ...this.defaults, ...options }
		Object.assign(this, mitt())
	}

	events = {
		'change [required]': 'onChange',
		submit: 'onSubmit'
	}

	/** *
	 * @memberof Validate
	 * @method setForm
	 * @desc set the form
	 * @param {HTMLElement} form - the form element to validate
	 *
	 * @return {Validate}
	 */
	setForm = form => {
		this.$el = form

		return this
	}

	/** *
	 * @memberof Validate
	 * @method setOptions
	 * @desc update the options
	 * @param {Object} options - validation rules and options
	 *
	 * @return {Validate}
	 */
	setOptions = options => {
		this.options = { ...this.options, options }

		return this
	}

	/** *
	 * @memberof Validate
	 * @method mount
	 * @desc bootstrap the form, add events
	 *
	 * @return {Validate}
	 */
	mount = () => {
		this.$$events = createEvents.call(this, this.$el, this.events)
		this.$$events.attachAll()

		const { rules } = this.options

		this.$fields = R.reduce((acc, field) => {
			const { name } = field
			const message = domify('<span class="form__error"></span>')
			const parent = field.closest('[data-field-row]')

			parent.appendChild(message)

			acc[name] = {
				field,
				parent,
				message
			}

			return acc
		}, {})([...this.$el.querySelectorAll('[required]')])

		if (rules) {
			this.$el.setAttribute('novalidate', true)
		}

		return this
	}

	/** *
	 * @memberof Validate
	 * @method unmount
	 * @desc remove the events and error nodes
	 *
	 * @return {void}
	 */
	unmount = () => {
		this.$$events.destroy()

		Object.entries(this.$fields).forEach(([, { message, parent }]) => {
			parent.removeChild(message)
		})
	}

	/** *
	 * @memberof Validate
	 * @method onChange
	 * @description Listen to change events on required fields
	 * @param {Object} e - event object
	 * @param {HTMLElement} elm - element that has changed
	 *
	 * @return {void}
	 */
	onChange = (e, elm) => {
		e.preventDefault()
		this.handleErrors(elm)
	}

	/** *
	 * @memberof Validate
	 * @method handleErrors
	 * @description add/remove errors
	 * @param {HTMLElement} elm - element that has changed
	 *
	 * @return {void}
	 */
	handleErrors = elm => {
		const { rules } = this.options
		const { name } = elm
		const errors = validate(this.$el, rules)
		const input = this.$fields[name]

		if (errors && errors[name]) {
			this.showError(input, errors[name])
			this.emit('input:error', {
				input,
				error: errors[name]
			})
		} else {
			this.removeError(input)
			this.emit('input:valid', {
				input
			})
		}
	}

	/** *
	 * @memberof Validate
	 * @method showError
	 * @description update the fields classes and inject the error message
	 * @param {Object} input - the fields object - includes, input, parent and message nodes
	 * @param {Array} error - an array of errors
	 *
	 * @return {void}
	 */
	showError = (input, error) => {
		const { message } = input

		Object.entries(input).forEach(([, node]) => {
			node.classList.remove('is-valid')
			node.classList.add('has-error')
		})

		message.textContent = error.join(' \n')
	}

	/** *
	 * @memberof Validate
	 * @method showError
	 * @description update the fields classes and remove the error message
	 * @param {Object} input - the fields object - includes, input, parent and message nodes
	 *
	 * @return {void}
	 */
	removeError = input => {
		const { message } = input

		Object.entries(input).forEach(([, node]) => {
			node.classList.remove('has-error')
			node.classList.add('is-valid')
		})

		message.textContent = ''
	}

	/** *
	 * @memberof Validate
	 * @method onSubmit
	 * @description handle form submission, check for errors and emit events
	 * @param {Object} e - the events object
	 *
	 * @return {void}
	 */
	onSubmit = e => {
		const { rules, ajax } = this.options

		const errors = validate(this.$el, rules)

		if (errors || ajax) e.preventDefault()

		if (errors) {
			const errorArray = Object.entries(errors).map(([key, value]) => {
				const input = this.$fields[key]
				this.handleErrors(input.field, value)

				return {
					input,
					value
				}
			})

			this.emit('submit:errors', errorArray)
		} else {
			this.emit('submit:success', {
				form: this.$el,
				fields: this.$fields,
				data: new FormData(this.$el)
			})
		}
	}
}
