import Plyr from 'plyr'

/** *
 * @namespace VideoPlayer
 * @class VideoPlayer
 * @description wrapper around plyr
 * @example
 *
 *
 * html:
 * <div class="plyr__video-embed c-info-item__thumbnail" data-ui="VideoPlayer">
 *   <iframe src="https://player.vimeo.com/video/76979871?loop=false&amp;byline=false&amp;portrait=false&amp;title=false&amp;speed=true&amp;transparent=0&amp;gesture=media" allowfullscreen allowtransparency allow="autoplay"></iframe>
 * </div>
 *
 * @desc Handles the videos... via plyr
 * @param {HTMLElement} el - the node to bind to
 *
 * @return {VideoPlayer}
 */
export default class VideoPlayer {
	constructor(el) {
		this.$el = el

		this.player = new Plyr(this.$el)
	}

	mount = () => {}

	/** *
	 * @memberof VideoPlayer
	 * @method unmount
	 * @desc Destroy the player
	 *
	 * @return {void}
	 */
	unmount = () => {
		this.player.destroy()
	}
}
