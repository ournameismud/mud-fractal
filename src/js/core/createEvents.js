import Delegate from 'dom-delegate'
import * as R from 'ramda'

export default (context, obj) => {
	const events = Object.entries(obj).map(([key, fn]) => {
		const eventAndNode = R.compose(R.map(R.trim), R.split(' '))(key)
		const capture = !!R.compose(R.length, R.match(/mouse/g), R.head)(
			eventAndNode
		)
		return [...eventAndNode, fn, capture]
	})

	let $delegate
	let emit

	const handleFunctions = R.curry((evt, transform, fns) => {
		R.compose(
			R.forEach(event => $delegate[transform](...event)),
			R.map(item => {
				return R.find(([a, b]) => [a, b].join(' ') === item)(evt)
			})
		)(fns)
	})(events)

	return {
		attachAll() {
			$delegate = $delegate || new Delegate(context)
			R.forEach(event => $delegate.on(...event))(events)
		},

		attach(fns) {
			$delegate = $delegate || new Delegate(context)
			handleFunctions('on', fns)
		},

		remove(fns) {
			if (!$delegate) return
			handleFunctions('off', fns)
		},

		destroy() {
			if (!$delegate) return
			R.forEach(event => $delegate.off(...event))(events)
		},

		emit($node, event) {
			emit = emit || document.createEvent('HTMLEvents')
			emit.initEvent(event, true, false)
			$node.dispatchEvent(emit)
		}
	}
}
