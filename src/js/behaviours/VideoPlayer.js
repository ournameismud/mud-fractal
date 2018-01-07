import Behaviour from '@/core'
import plyr from 'plyr'

const controls = `
<button type="button" data-plyr="play" class="absolute text-white z-2 u-center" aria-label="Play">
<i class="icon icon--ui-video-play">
	<svg>
		<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#ui-video-play"></use>
	</svg>
</i>
<span class="plyr__sr-only">Play</span>
</button>
<div class="plyr__controls">
	<button data-plyr="restart" type="button"><svg>
	<use xlink:href="#plyr-restart"></use></svg> <span class="plyr__sr-only">Restart</span></button> <button data-plyr="rewind" type="button"><svg>
	<use xlink:href="#plyr-rewind"></use></svg> <span class="plyr__sr-only">Rewind {seektime} secs</span></button> <button data-plyr="play" type="button"><svg>
	<use xlink:href="#plyr-play"></use></svg> <span class="plyr__sr-only">Play</span></button> <button data-plyr="pause" type="button"><svg>
	<use xlink:href="#plyr-pause"></use></svg> <span class="plyr__sr-only">Pause</span></button> <button data-plyr="fast-forward" type="button"><svg>
	<use xlink:href="#plyr-fast-forward"></use></svg> <span class="plyr__sr-only">Forward {seektime} secs</span></button> <span class="plyr__progress"><label class="plyr__sr-only" for="seek{id}">Seek</label> <input class="plyr__progress--seek" data-plyr="seek" id="seek{id}" max="100" min="0" step="0.1" type="range" value="0"> <progress class="plyr__progress--played" max="100" role="presentation" value="0"></progress> <progress class="plyr__progress--buffer" max="100" value="0"><span>0</span>% buffered</progress> <span class="plyr__tooltip">00:00</span></span> <span class="plyr__time"><span class="plyr__sr-only">Current time</span> <span class="plyr__time--current">00:00</span></span> <span class="plyr__time"><span class="plyr__sr-only">Duration</span> <span class="plyr__time--duration">00:00</span></span> <button data-plyr="mute" type="button"><svg class="icon--muted">
	<use xlink:href="#plyr-muted"></use></svg> <svg>
	<use xlink:href="#plyr-volume"></use></svg> <span class="plyr__sr-only">Toggle Mute</span></button> <span class="plyr__volume"><label class="plyr__sr-only" for="volume{id}">Volume</label> <input class="plyr__volume--input" data-plyr="volume" id="volume{id}" max="10" min="0" type="range" value="5"> <progress class="plyr__volume--display" max="10" role="presentation" value="0"></progress></span> <button data-plyr="captions" type="button"><svg class="icon--captions-on">
	<use xlink:href="#plyr-captions-on"></use></svg> <svg>
	<use xlink:href="#plyr-captions-off"></use></svg> <span class="plyr__sr-only">Toggle Captions</span></button> <button data-plyr="fullscreen" type="button"><svg class="icon--exit-fullscreen">
	<use xlink:href="#plyr-exit-fullscreen"></use></svg> <svg>
	<use xlink:href="#plyr-enter-fullscreen"></use></svg> <span class="plyr__sr-only">Toggle Fullscreen</span></button>
</div>`

export default class VideoPlayer extends Behaviour {
	constructor() {
		super()
		plyr.setup({
			html: controls
		})
	}
}
