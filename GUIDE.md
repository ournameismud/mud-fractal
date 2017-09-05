# Mudstone Documentation


#### TLDR;
`npm start` and you're good to go! 

**The only change you will need to make to the config is the browsersync proxy url.**
`gulp/paths.config.cms`

- To deploy a **static build** run `npm run build`
- To deploy to **craft** use `npm run build:cms`

When running `gulp` the javascript bundle is served from memory, meaning no file is written to disk.
Just note that running gulp will not build a js bundle you can access

## Folder Structure

#### Code assets
- _assets/scss/*.scss 
- _assets/html/nunjucks/*.njk
- _assets/js/*.js
 
#### Static assets
- _assets/images/site/*.[.jpg, .png]
- _assets/images/svg-symbols/*.svg
- _assets/images/svg-assets/*.svg
- _assets/favicons/
- _assets/fonts/


#### Files
- `.babelrc` Babel settings for gulp tasks only
- `.eslintrc` Eslint settings
- `.jsbeautifyrc` Beautify settings
- `.stylelintrc` Stylelint config settings
- `.stylelintignore` Paths stylelint should ignore
- `gulp.babel.js` The gulps tasks entry point
- `package.json` Dependencies
- `yarn.lock` The yarn lock file!

## Tasks

The following gulp tasks are available, it should be pretty obvious what they do.  Each task is preceded with `gulp`
- fonts
- scss 
- bundle:script
- favicons
- json (moves any json files from `_assets/js/json/` to `BASEDIR/public`)
- cssFonts
- move-scripts
- clean 
- html
- symbols
- svgs
- images
- cacheBuster
- watch
- browserSync
- build

## NPM Scripts

All of the standard gulp tasks are available, i.e. `gulp images`. The following npm scripts are just pointers to gulp tasks (npm start === gulp), rather pointless when you think about it, but hey ho! 

- `npm start` Empty build folder, rebuild and watch everything
- `npm run dev` Same as above, without rebuilding everything
- `npm run cms` Same as start but with the environment set to cms
- `npm run compile` Build all the things in development mode
- `npm run build` Build all the things in production mode
- `npm run build:cms` As above but in production cms mode  

Any task can be run independently in any of the environments.

`gulp images --cms`

`gulp images --production`

`gulp images --cms --production`

## Linting

scss: https://github.com/stylelint/stylelint-config-standard

javascript: http://eslint.org/docs/rules/


## Task tutorial

Each task is comprised of four components.

#### Paths

`gulp/paths.config.dev.json`

```
  "images": {
    "src": "images/site",
    "dest": "dist/images"
  },
```

A json object with a src and dest key/value pair. The source path is relative from the assets directory, and the dest path is relative from public

#### Task config

The name (key) of the object must match the name of the task function

`gulp/task.config.js`

```
	images: {
		task: 'asset',
		watch: true,
		extensions: ['jpg', 'png', 'svg', 'gif']
	},
```
- task: *String*, type of task, `'code'` or `'asset'` (asset tasks run before code tasks)  **required** 
- watch: *Boolean*, should gulp watch for changes 
- extensions: *Array* of file extensions **required** 

#### Gulp task
`gulp/tasks/images.js`

```
/*
	import required modules
*/
import changed from 'gulp-changed'
import gulp from 'gulp'
import imagemin from 'gulp-imagemin'
import browserSync from 'browser-sync'
import { getPaths } from '../libs/utils'

/*
	export named function
*/
export function images() {
	/* see comment below about paths */
	const paths = getPaths('images')
	
	return gulp.src(paths.src)
		.pipe(changed(paths.dest))
		.pipe(imagemin())
		.pipe(gulp.dest(paths.dest))
		.pipe(browserSync.stream())
}

/*
	expose gulp task
*/
gulp.task('images', images)
```

*Note:* Sometimes you only want provide a single file to the gulp task, in which case you can use the following snippet

```
/// other scss dependencies
import path from 'path'


// paths object
const paths = {
	src: path.resolve(process.env.PWD, PATH_CONFIG.src, PATH_CONFIG.scss.src, '*.scss'),
	dest: path.resolve(process.env.PWD, PATH_CONFIG.dest, PATH_CONFIG.scss.dest)
}

```


#### Export Gulp task
`gulp/tasks/index.js`

```
export { images } from './images'
```



And that's it! 

## Javascript
https://webpack.js.org/configuration/

## Environments

There are three possible environments, each configured with a paths.config.*env*.json file.  When they are merged together it is a shallow merge, so all of the settings for a given object will be required. 

- `paths.config.dev.json` This is the main one, most of the paths don't change so everything must go in this file

```
{
  "baseDir": "./deploy/public",
  "dest": "./deploy/tmp",
  "dist": "./deploy/tmp/dist",
  ...etc etc
}
```

- `paths.config.production.json` Here we can overwrite some paths, and server settings

```
{
  "baseDir": "./deploy/public",
  "dest": "./deploy/public",
  "dist": "./deploy/public/dist",

  
	"browserSync": {
		"server": {
			"baseDir": "deploy/public",
      "index": "index.html"
		}
	}
}

```

- `paths.config.cms.json`A few more settings need to be changed for cms mode

```
{
  "baseDir": "./deploy/public",
  "dest": "./deploy/public",
  "dist": "./deploy/public/dist",
  
	"browserSync": {
		"server": {
			"baseDir": "deploy/public",
      "index": "index.php"
		},
    "proxy": "http://local.ournameismud.co.uk"
	},

  "symbols": {
    "src": "images/svg-symbols",
    "dest": "dist/images",
    "fileName": "_symbols.twig",
    "fileDest": "../deploy/craft/templates/includes"
  },

  "tags": {
    "src": "./deploy/craft/templates/wrapper/_layout.twig",
    "dest": "./deploy/craft/templates/wrapper/",
    "css": "/dist/css/",
    "js": "/dist/js/"
  }
}
```

## Debugging

#### Tasks

Does each task have a corresponding function, with the same name (see above)

`yarn install` to make sure you have the latest dependencies

If you can't see where the task is crashing try commenting each of the task objects `(gulp/task.config.js)`

If the problem is coming from either scss or javascript try commenting out in `style.scss` and `app.js`.  

Go nuclear, delete the `node_modules` folder and do anther `yarn`

Google!

#### Missing files

Make sure the css and js html tags are wrapped in the following comment blocks

```
<!-- build:css-->
	<link rel="stylesheet" href="/dist/css/style.css">
<!-- endbuild-->


<!-- build:js-->
	<script src="/dist/js/bundle.js"></script>
<!-- endbuild-->

```

Any markup between the comment blocks will be replaced.  Running the build tasks will appended a time stamp to the end of each file name.

`<script src="/dist/css/style.59843957348.js"></script>`
`<script src="/dist/js/bundle.59843957348.js"></script>`

Check the destination path configs are correct.

#### Nothing loads

Sounds like a browsersync problem.  Check the settings in the path config files.

#### Unexpected token in npm module

Sounds like a babel transform issue, so may need to install a babel transform plugin and update the webpack.config file (`gulp/tasks/webpack.babel.config`).  Check for github issues. 