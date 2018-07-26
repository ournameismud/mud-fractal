# mud-fractal

![Mud](https://ournameismud.co.uk/android-chrome-192x192.png)

## Webpack / Gulp / Fractal

> Frontend starter kit integrated with [Fractal](http://fractal.build/), inspired by [Blendid](https://github.com/vigetlabs/blendid), powered by gulp, webpack.

All of the build/task dependencies are managed through a single npm package. [mulp](https://github.com/ournameismud/mulp)

## Docs

[Workflow](https://github.com/ournameismud/mud-fractal/blob/master/Notes.md)

[Structure](https://github.com/ournameismud/mud-fractal/blob/master/src/docs/index.md)

[JS Setup](https://github.com/ournameismud/mud-fractal/blob/master/src/js/README.md)

## Getting started

Clone the repo… and install

### Installation

`yarn` / `npm install`

### Dev mode

######  Start fractal server

`npm start`

###### With craft

`npm run cms`

### Builds

###### Create a library build

`npm run build:fractal`

###### Create a production build

`npm run build`

###### Create an optimised build with critical/purge css

`npm run build:production`

###### Build fractal components

`npm run build:components`

###### Create a static build (see publish settings in gulp/path.config.json)

`npm run build:static`

### Unit and regression tests

###### Save a snapshot of components for regression testing

`npm run reference`

######  Test against the snapshots with an optimised build

`npm run diff`

###### Run any tests with jest

`npm run test`

###### Run tests in watch mode

`npm run test:watch`

###### Get a test coverage report

`npm run coverage`

### Deployment (netlify)

###### If you have netlify setup, you can deploy the fractal library with this

`npm run deploy`

### https

###### Create https certs for browsersync

`npm run gen-cert`

### Linting/formatting

###### Lint all the javascript feels

`npm run lint:js`

###### Format all the code with prettier

`npm run pretty`

###### Generate documentation

`npm run generate-docs`

### Fractal helpers

The following commands require `komp`: https://github.com/FrancisVega/komp (`npm i -g komp`)

###### Scaffold new objects/components/etc

`komp new --template fractal ./02-objects/example-obj`

`komp new --template fractal ./03-globals/example-global`

`komp new --template fractal ./04-components/example-component`

###### Scaffold new page

`komp new ./05-objects/example-page --template page`

### Postcss plugins available:

- [postcss-inline-svg](https://github.com/TrySound/postcss-inline-svg)
- [postcss-write-svg](https://github.com/jonathantneal/postcss-write-svg)
- [postcss-aspect-ratio](https://www.npmjs.com/package/postcss-aspect-ratio)
- [postcss-animation](https://www.npmjs.com/package/postcss-animation)
- [postcss-triangle](https://github.com/jedmao/postcss-triangle)
- [postcss-object-fit-images](https://github.com/ronik-design/postcss-object-fit-images)
- [rucksack-css](https://github.com/seaneking/rucksack)
- [postcss-easing-gradients](https://github.com/larsenwork/postcss-easing-gradients)
- [tailwind](https://tailwindcss.com/)
