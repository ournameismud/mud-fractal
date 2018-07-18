# Mud-Fractal Workflow
[Overview | Mud-Fractal](http://pensive-williams-a0c767.netlify.com/)

Clone/Download [GitHub - ournameismud/mud-fractal: Fractal/Mudstone Frontend Boilerplate](https://github.com/ournameismud/mud-fractal)  and install all the dependencies.

## TLDR

When going live... 

`npm run reference` 

`npm run diff` 

If everything is good

`npm run build:production`

If you've made some changes to the markup, you will need to run `npm run build:fractal` before running `npm run build:production` as the purge/critical css is based on the fractal build

*Important!*

When running the site through purgecss it is important that all of the markup is contained within the fractal src.  Purgecss checks for class names in the fractal output (deploy/library/components/preview/*.html). This way all of the possible markup is exposed and not just the html that is currently rendered by the cms (for example a feature might be turned off on the site, but it could be enabled by the site admins and thus the css would be missing)


## Install

`yarn install`

## Tailwind config
The official documentation is top notch so we don’t need to explain much here.

[Configuration - Tailwind CSS](https://tailwindcss.com/docs/configuration)

With any project, we usually start by assembling all of the relevant base  styles into variables to use throughout the sass code base.  The same applies here, except rather than having access to a sass variable you get a class name you can directly use in the markup, or via the `@apply` syntax in regular ole sass

```
<button class="text-red text-1xl border-t border-green shadow py-4 px-8">Gary</button>
```

Or 

```
<button class="o-btn">Gary</button>
```
```
.o-btn {
	@apply .text-red .text-1xl .border-t .border-green .shadow .py-4 .px-8;
}
```


## Fractal
Start the fractal server

`npm start`

Make a component, object, global or page template, 

Absolute minimum is a twig file
`/src/templates/04-components/demo/demo.twig`

```
<div class="c-demo">
	<h1>{{ heading }}</h1>
	{{ body }}
	<img src="{{ image.url }}" width="{{ image.width }}" height="{{ image.height }}" alt="{{ image.alt }}" />
	<a href="{{ link.url }}">{{ link.text }}</a>
</div>
```

Add some scss

`/src/templates/04-components/demo/_demo.scss`

Add a config file

`/src/templates/04-components/demo/demo.config.js`

```
module.exports = {
	status: 'test', // required for regression testing

	context: {
		heading: 'I am the heading, hear me roar',
		body: '<p>bla bla bla</p>'
		link: {
			url: '#0',
			text: 'Read more'
		},
		image: {
			url: 'test.jpg',
			width: '300',
			height: '200',
			alt: 'A picture of a tree, with an owl'
		}
	}
}
```


Almost every component/object that is created in fractal will have each of these three files.

There should be no hardcoded content in the twig files.

When you want to assemble a page template, import all of the required components  into the file.  

`/src/templates/05-pages/example/example.twig`

`/src/templates/05-pages/example/example.config.js`


```
{% import '@helpers' as h %}

{% extends craft.app.config.general.custom.wrapper ~ '_layout.twig' %}

{% block critical_css %}
	<!-- build:critical-->
	<!-- endbuild -->
{% endblock %}

{% block pageTheme %}float-header{% endblock %}

{% block content %}
<div class="barba-container">
	{% include '@demo' with { demo: demo } %}
	
	<div class="wrapper">	
		{% include '@panel' with { panel: panel } %}
	</div>
</div>

{% endblock %}
```


You will need to copy the config data from the component into the page config.

```

module.exports = {
	status: 'test', // required for regression testing

	context: {
		demo: {
			heading: 'I am the heading, hear me roar',
			body: '<p>bla bla bla</p>'
			link: {
				url: '#0',
				text: 'Read more'
			},
			image: {
				url: 'test.jpg',
				width: '300',
				height: '200',
				alt: 'A picture of a tree, with an owl'
			}
	}
}
```

The page config will be used by the backend team

## Craft CMS

To convert the fractal components into craft components run `npm run build:components` 

This will move all of the twig files to `deploy/craft/templates/_partials` and create a json file that is imported into craft via the  [Fractal plugin port for Craft 3](https://github.com/ournameismud/fractal)

The backend team shouldn’t have to touch any of the generated html.  Any changes that are made must be made in the src folder.  Running `npm run cms` will update and live reload any changes made in the src directory.

Any twig files within the normal craft setup will only be responsible for providing the fractal files with data.

Example: 

```
{% set data = {
		hero: homeHero,
		slides: homeSlides,
		dropDown: {
		 	label: homeDropdownLabel,
		 	items: homeDropdown
		},
		cards: homeCard
	}
%}

{% include '@home' with data %}
```

## Production
#### Critical CSS

Each page template should have the following block:

```
{% block critical_css %}
	<!-- build:critical-->
	<!-- endbuild -->
{% endblock %}
```

Before we can critically inline the css we should first build the fractal library
`npm run build:fractal`

This will build the fractal library to `deploy/library`

Now we need to setup the config to import the right files

Example: `path.config.cms.json`

```
"critical": {
		"urlBase": "./deploy/library/",
		"paths": [
			{
				"url": "./deploy/library/components/preview/home.html",
				"source": "deploy/templates/_partials/05-pages/home/home.twig"
			}
		]
	}
```

#### Purge CSS
Before pushing to production we need to remove any unused css.

Any css that is added via javascript will need to be added to the purge whitelist.

`gulp/task.config.js`

```
purge: {
		whitelistPatterns: [/plyr/, /is-/, /has-/, /no-/, /icon--/]
	},
```

See [GitHub - FullHuman/purgecss: Remove unused css](https://github.com/FullHuman/purgecss) for more information

But first, before we remove any unused css we should take a snapshot of each component so we can test to make sure we don’t remove any ‘used’ css!

Each component should have a config file (see fractal notes above) with a status of ‘test’

To take a snapshot run `npm run reference`
This will build all of the components, then take a snap shot of each component at various breakpoints

Now run `npm run diff` 

This will rebuild again, but this it will remove any unused css. It will then take another snapshot of each component and then compare against the previous snapshots.

Once complete the results will be displayed in the browser.

If everything has passed… We’re good to go live… Now you should run `npm run build:production`
