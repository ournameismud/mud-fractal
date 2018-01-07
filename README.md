# Gulp + Fractal
![Mud](http://ournameismud.co.uk/css/images/maps-icon.png)

> Frontend starter kit integrated with [Fractal](http://fractal.build/), inspired by [Blendid](https://github.com/vigetlabs/blendid)


###### Requirements
- node >= 8.6.0
- gulp >= 3.91
- yarn/npm
- webpack >= 3.0.0

###### Installation

`yarn add mulp`

###### Gettings Start

Create project config files and folder structure (fractal mode)

`yarn run mulp -- init:fractal`

Create project config files and folder structure (html mode)

`yarn run mulp -- init:html`

Start development server

`yarn run mulp`

Use a custom path config file: `path.config.cms.json`

`yarn run mulp -- -- --config cms`

Create a production build

`yarn run mulp -- build -- --env production --config cms`
