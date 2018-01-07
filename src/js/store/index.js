import { createStore, combineReducers } from 'redux'
import * as reducers from './reducers'
import * as _a from './actions'

export default createStore(combineReducers(reducers))

export const actions = _a
