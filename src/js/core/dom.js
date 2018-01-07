import { $ } from 'domtastic/src/selector'
import * as DomMutation from 'domtastic/src/dom'
import * as DomClass from 'domtastic/src/dom/class'
import { css } from 'domtastic/src/css'
import { closest } from 'domtastic/src/selector/closest'

$.fn = { ...DomMutation, ...DomClass, ...{ css, closest } }

export default $
