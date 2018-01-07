import * as types from './types'

export const counter = (state = 1, { type, value }) => {
	switch (type) {
	case types.ADD:
		return state + value
	case types.MINUS:
		return state - value
	default:
		return state
	}
}

export const mango = (state = 1, { type, value }) => {
	switch (type) {
	case types.MULTIPLY:
		return state * value
	case types.DIVIDE:
		return state / value
	default:
		return state
	}
}
