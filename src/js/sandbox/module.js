import { parseUrl } from '@/core/router/utils'
import * as R from 'ramda'

let segmentize = uri =>
	uri
		// strip starting/ending slashes
		.replace(/(^\/+|\/+$)/g, '')
		.split('/')

const string = '/blog/p10/'
const otherSt = ''

const p = parseUrl(string)

const pubes = segmentize(string).join('/')

const exp = `/(\/${pubes}\/)?(p)+(\d+)/g` // this pattern yeah
