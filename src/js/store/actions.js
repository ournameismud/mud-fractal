import * as types from './types'

export const add = value => ({ type: types.ADD, value })
export const minus = value => ({ type: types.MINUS, value })
export const multiply = value => ({ type: types.MULTIPLY, value })
export const divide = value => ({ type: types.DIVIDE, value })
