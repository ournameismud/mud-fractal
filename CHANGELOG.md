# Change Log

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

### 7.1.0

#### Added

- JSON to scss
- Fractal
- Tests (wip)
- Barba integration

#### Breaking Change

- query dependency removed, event delegation with `npm dom-delegate`
- javascript folder structure changed
- Base events object syntax


### 7.0.25

#### Change

- Build size report only shows dist assets

### 7.0.24

#### Added

- Inline svg postcss plugin added

```
background: svg-load('arrow.svg', fill=#000000, stroke=#ffffff) no-repeat;
```

### 7.0.23

#### Change

- timestamp passed into nunjucks data, or as a craft set object
- remove `Task` as a suffix from all gulp functions, updated docs


### 7.0.22

#### Added

- Babel-polyfill added to bundle

#### Update

- Helpers ui functions extend Concert

#### Change

- html output path in cms mode

### 7.0.21

#### Update

- Dependencies, webpack validator no longer required

### 7.0.20

#### Added

- Watch twig files for changes

### 7.0.19

#### Added

- A few more commonly-used grid sizings.
- Latest versions of `size` and `t-html` CSS Typographic mixins.

### 7.0.18

#### Added

- nunjucks string filters, nbr2tag and nbr2br (see gulp/tasks/htmls.js for examples)
- `npm run compile` like build, except it doesn't minify or append a timestamp to the files

### 7.0.17

#### Added

- Better media query debugging

### 7.0.16

#### Fixed

- Stylelint rules for some post css plugins (aspect-ratio and quantity queries)

### 7.0.15

#### Change

- Fill attributes no longer stripped from svg symbols

```
.pipe(cheerio({
	run($) {
		$('[fill]').removeAttr('fill');
	},
	parserOptions: {
		xmlMode: true
	}
}))
```

### 7.0.14

#### Added

- nunjucks random filter

### 7.0.13

#### Fixed

- https://github.com/cole007/mudstone/issues/7

### 7.0.12

#### Added

- Dave MW's `@include size(mob,desktop,line-height)` font size function based on Typographic scaling sizes.

### 7.0.11

#### Fixed

- https://github.com/cole007/mudstone/issues/6

### 7.0.10

#### Added

- has/not/limit custom nunjucks filters added


### 7.0.9

#### Change

- Updated dependencies to latest version


### 7.0.8

#### Fixed

- https://github.com/cole007/mudstone/issues/5


### 7.0.7

#### Added

- Legacy tasks added (scripts pre es6, pug)

### 7.0.6

#### Added

- SVG sprite task added

### 7.0.5

#### Changed

- Autoprefixer set to last 8 versions

### 7.0.4

#### Added

- editorconfig added

### 7.0.3

#### Changed

- Better error messaging in behaviour loader.  

### 7.0.2

#### Added

- stylelint max nesting rule added

### 7.0.1

#### Changed

- nunjucks wrapper extends shell

#### Fixed

- resp-size mixin fix when true passed to line-height argument

### 7.0.0

#### Added

- Changelog file!
- User guide
- Stylelint
- Configuration files
- Webpack 2

#### Changed

- Gulp tasks have been completely rewritten
- Config options files
- NPM scripts

#### Removed

- Pug (replaced with nunjucks)

### 6.0.0

#### Added

- Rollup.js

#### Removed

- Iconfonts
- Sprites
- Browserify


### 5.0.0

#### Added

- Babel
- Browserify
