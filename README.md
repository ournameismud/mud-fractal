# mud-fractal

## Gulp + Fractal

![Mud](http://ournameismud.co.uk/css/images/maps-icon.png)

> Frontend starter kit integrated with [Fractal](http://fractal.build/), inspired by [Blendid](https://github.com/vigetlabs/blendid), powered by gulp, webpack.

All of the build/task dependencies are managed through a single npm package. [mulp](https://github.com/ournameismud/mulp)

### Getting started

Clone the repo… and install

###### Installation

`yarn` / `npm install`

###### Gettings Start

> Start fractal server

`npm start`

> With craft

`npm run cms`

> Create a library build

`npm run build:fractal`

> Create a production build

`npm run build`

> Create an optimised build with critical/purge css

`npm run build:production`

> Build fractal components

`npm run build:components`

> Create a static build (see publish settings in gulp/path.config.json)

`npm run build:static`

> Save a snapshot of components for regression testing

`npm run reference`

> Test against the snapshots with an optimised build

`npm run diff`

> If you have netlify setup, you can deploy the fractal library with this

`npm run deploy`

> Run any tests with jest

`npm run test`

> Run tests in watch mode

`npm run test:watch`

> Get a test coverage report

`npm run coverage`

> Create https certs for browsersync

`npm run gen-cert`

> Lint all the javascript feels

`npm run lint:js`

> Format all the code with prettier

`npm run pretty`
