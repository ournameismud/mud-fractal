# Mudstone
![Mud](http://ournameismud.co.uk/css/images/maps-icon.png)

Frontend starter kit integrated with fract
http://fractal.build/

See user-guide.md

###### Requirements
- node >= 6.9.1
- npm >= 3.3.12
- gulp >= 3.91
- yarn >= 0.17.10
- webpack >= 2.2.0

###### Installation

`yarn`

###### Development mode

`npm start`

###### Minify css and javascript
`npm run build`

## Gulp

* Transpile es6 to es5 with babel
* Bundle js with webpack 2
* Javascript linting with eslint
* Lossless image compression
* SVG symbol generater
* Compile nunjucks template
* Compile scss (with postcss autoprefixer)
* SCSS linting with stylelint
* Livereload and server with BrowserSync

### Credit

Heavily inspired by Viget's belting gulp-starter (blendid branch).  This is basically an es6 fork, with a few things added and a few things removed
https://github.com/vigetlabs/gulp-starter/tree/blendid


### Setup
All of the file paths are defined in `gulp/path.*.*.json`  The CMS and Production version are merged into the dev one when in cms/production mode
You can run any gulp task with --cms or --production (or both) to compile the various environment versions.

### Workflow

To begin development run `npm start`, this will rebuild all of the assets, start browsersync and watch all of the assets for changes. The css and javascript is unminified during development. Before deploying code to a production environment run `npm run build` to compress scss/js and remove any source maps.

### NPM modules

For any npm modules that will be used in production use `yarn add bla`, all other scripts (like gulp tasks) should be saved as dev dependencies (yarn add bla --dev)

### NPM scripts

- `npm start` - fresh build and server
- `npm run dev` - aka `gulp`
- `npm run cms` - gulp in cms mode
- `npm run build` - build all the things in production mode
- `npm run build:cms`- build all the things in production mode for a cms site

### CSS
postcss plugins:
- https://github.com/arccoza/postcss-aspect-ratio
- https://github.com/peterramsing/lost
- https://github.com/jonathantneal/postcss-write-svg
- https://github.com/zhouwenbin/postcss-animation
- https://github.com/pascalduez/postcss-quantity-queriespostcs
- https://github.com/jedmao/postcss-triangle

node includes
- https://github.com/modularscale/modularscale-sass

## Git methodology

At a core we should be working on four branches:

- master
- dev / backend
- deploy/staging
- deploy/production

Dev work should be merged into master before going into deployment.

Any extra branches should be feature-specific and named accordingly, e.g.

- feature/nav
- feature/add-on-x

Once completed a feature branch should be merged into master and removed. Ideally when logging time we should be adding comments related to the feature(s) we are working on.

### Tips
`git branch` - list branches in a repository  
`git branch feature/nav` - create new git branch  
`git branch -D feature/nav` - create new git branch  
`git checkout feature/nav` - moves branch and updates working directory  
`git merge feature/nav` - merge development branch into master (must checkout into master first)  
