const { colors } = require('./colors')
/*
  |-----------------------------------------------------------------------------
  | Background sizes               https://tailwindcss.com/docs/background-size
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your background sizes. We provide some common
  | values that are useful in most projects, but feel free to add other sizes
  | that are specific to your project here as well.
  |
  | Class name: .bg-{size}
  |
  */

const backgroundSize = {
	auto: 'auto',
	cover: 'cover',
	contain: 'contain'
}

module.exports = {
	backgroundSize,
	backgroundColors: colors
}
