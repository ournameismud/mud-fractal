# Spon.js

Spon.js is little framework to help manage javascript functionality for modern websites. It servers two purposes. The first is to manage the loading and initialisation of javascript modules (behaviours). The second is to control page transitions (router\*), commonly referred to as PJAX.

The main idea behind this framework is to marry the two requirements together.

### Behaviour Features:

- [ ] code splitting based on data-behaviour attributes (powered by web pack)
- [ ] component based event delegation (dom-delegate.js)
- [ ] global event emitter (mitt.js)
- [ ] screen size events and utilities
- [ ] viewport detection (intersection observer)
- [ ] refs object which queries the component for any data-module elements
- [ ] page transition events

\*It’s not really a router... but it wants to behave like one!

### Router Features

- [ ] Custom transitions for any URL
- [ ] Prefetching html on a different thread (Web Worker)
- [ ] Mouse enter based prefetch
- [ ] Full control over the exit/entrance html
- [ ] Full back button support (history.js)
- [ ] Transition lifecycle
- [ ] Event emitter
- [ ] Error handling

## Getting started

### app.js

`src/js/app.js`

Some imports…

```javascript
// console log util... log('message')
import '@/plugins/logger'
// The main app class
import App from '@/core/App'
```

We can now instantiate a `new` App class

One of the properties the `App` expects is a `chunks` function. This is the function that will be used to load data behaviours

He we’re using `dynamic imports` to asynchronously load our javascript modules. This function is resolved by the app loader.

The chunks function is called for each element in the html that has a `data-behaviour` attribute.

```html
<div data-behaviour="ModuleA"></div>
```

The `@` symbol is an alias defined in the web pack config that resolves to the root js folder, i.e. `src/js/`

```javascript
new App({
	chunks: behaviour => import(`@/behaviours/${behaviour}`)
}).mount()
```

## Behaviour modules

`src/js/behaviours/ModuleA.js`

Each behaviour that is loaded via the chunks property **must** be a `class` that extends the root `Behaviour`. The new class must be the default export

Let’s import the `Behaviour`

```javascript
import Behaviour from '@/core/Behaviour'

export default class extends Behaviour {}
```

Boom! We have a behaviour. (As it’s the default you can omit the name… but sometimes it’s nice to name things anyway)

**The constructor**

You shouldn’t ever have to use the constructor…

```javascript
import Behaviour from '@/core/Behaviour'

export default class ModuleA extends Behaviour {
	/***
	 * constructor
	 * @param el:HTMLElement - the html node with the data-behaviour
	 *
	 * @ param name:string - a name for the behaviour
	 *
	 */
	constructor(el, name) {
		super(el, name)
	}
}
```

Instead… use the `mount` method. This is called after the behaviour has been instantiated

```javascript
export default class ModuleA extends Behaviour {
	mount() {
		// start defining your behaviours functionality here

		this.$el.hasAttribute('data-behaviour="ModuleA"') // true
	}
}
```

#### Mixins

Rather than adding all of the common utilities, such as Dom and window events, to the main `Behaviour` class each piece of functionality can be combined during instantiation

Let’s add some Dom events

```javascript
import Behaviour, { mix } from '@/core/Behaviour'
import { EventsMixin } from '@/core/modules/createEvents'

export default class ModuleA extends mix(Behaviour).with(EventsMixin) {
	mount() {
		// add each of the events defined
		// in the events object
		// each event is delegated to this.$el
		this.$$events.attachAll()

		// you can also attach events by key
		// this.$$events.attach('click [data-button]')
		// this.$$events.remove('click [data-button]')
		// this can be useful when dealing with responsive behaviours
	}

	// {'event element' : function }
	events = {
		'click [data-button]': 'onClick'
	}

	onClick = (event, element) => {
		event.preventDefault()
		element.classList.toggle('is-clicked')
	}
}
```

Wonderful… how about some window resize events

```javascript
import Behaviour, { mix } from '@/core/Behaviour'
import { EventsMixin } from '@/core/modules/createEvents'
import { ResizeMixin } from '@/core/modules/resizer'

export default class ModuleA extends mix(Behaviour).with(
	EventsMixin,
	ResizeMixin
) {
	mount() {
		this.$$events.attachAll()

		this.$$screen.on('resize', props => {
			console.log(...props)
		})

		const width = this.$$screen.width
		const height = this.$$screen.height
	}

	// {'event element' : function }
	events = {
		'click [data-button]': 'onClick'
	}

	onClick = (event, element) => {
		event.preventDefault()
		element.classList.toggle('is-clicked')
	}

	// each matching breakpoint will be called on load
	// and again on resize when the breakpoints state changes.  If the the breakpoint fails the function will be called again, with props.match set to false
	screens = {
		'(min-width: 1024px)': props => {
			if (props.match) {
				console.log(...props)
			}
		},

		'(min-width: 680px)': props => {}
	}
}
```

SPRING BREAK… intersection observer anyone?

```javascript
import Behaviour, { mix } from '@/core/Behaviour'
import { EventsMixin } from '@/core/modules/createEvents'
import { ResizeMixin } from '@/core/modules/resizer'
import { InviewMixin } from '@/core/modules/inview'

export default class ModuleA extends mix(Behaviour).with(
	EventsMixin,
	ResizeMixin,
	InviewMixin
) {

	// removed other stuff for the sake of the trees

	viewport: {
		enter() {
			console.log(this.$el, 'is in the viewport')
		},

		exit() {
			console.log(this.$el, 'is not in the viewport')
		}
	}

}
```

Refs… rather than manually querying the Dom, why not let the framework do some of the work.

Given the following html:

```html
<div id="test" data-behaviour="HomePage">
	<div data-element="gary" data-name="gary" data-amount="10">
		<h1>Gary</h1>
	</div>
	<div data-element="sally" data-name="sally" data-amount="10">
		<h1>Sally</h1>
	</div>
</div>
```

By using the RefsMixin you’ll have the following object available

```
{
  "gary": {
    "node": HTMLElement,
    "name": "gary",
    "amount": "10"
  },
  "sally": {
    "node": HTMLElement,
    "name": "sally",
    "amount": "10"
  }
}
```

Example:

```javascript
import Behaviour, { mix } from '@/core/Behaviour'
import { EventsMixin } from '@/core/modules/createEvents'
import { ResizeMixin } from '@/core/modules/resizer'
import { InviewMixin } from '@/core/modules/inview'
import { RefsMixin } from '@/core/modules/refs'

export default class ModuleA extends mix(Behaviour).with(
	EventsMixin,
	ResizeMixin,
	InviewMixin,
	RefsMixin
) {
	// removed other stuff for the sake of the trees
	mount() {
		const {
			sally: { amount },
			gary: { node: $gary }
		} = this.$$refs

		$gary.classList.add('is-gary')

		console.log(amount)
	}
}
```

#### Events

Every Behaviour has access to a global event emitted

\_src_js_behaviours_ModuleA.js

```javascript
export default class ModuleA extends Behaviour {
	mount() {
		this.$$eventBus.on('some:event', value => {
			console.log(value)
		})
	}
}
```

\_src_js_behaviours_ModuleB.js

```javascript
export default class ModuleB.js extends Behaviour {
	mount() {
		const value = 10
		this.$$eventBus.emit('some:event', value)
	}
}
```

You can also access the event bus by importing it

```javascript
import eventBus from '@/core/modules/eventBus'

export default class ModuleB.js extends Behaviour {
	mount() {
		const value = 10
		eventBus.emit('some:event', value)

		eventBus.on('ROUTE_TRANSITION_ENTER', (props) => {
			console.log(props)
		})
	}
}
```

#### Destroying

If you need to destroy any custom code when a page transition occurs use the unmount method

Eg

```javascript
export default class ModuleB.js extends Behaviour {
	// ...,
	unmount() {
		this.flickity.destroy()
		this.cancelAnimation()
	}
}
```

That’s 90% of behaviours.

## Router

Back to `app.js`

```javascript
import '@/plugins/logger'
import App from '@/core/App'
import routes from '@/views' // the routes array used by the router!

new App({
	/***
	 * router
	 *
	 * @property routes :array - routes object
	 * @property rootNode:HTMLElement - the root html node
	 * @property navLinks :array - an array of links that should update on navigation
	 * @property classes :object - clases applied to active links
	 * @property onExit :function - called before the dom is updated
	 * @property onEnter :function - called after the dom is updated
	 *
	 */
	router: {
		routes,
		rootNode: document.getElementById('page-wrapper'),
		navLinks: [
			...document.querySelectorAll('header a'),
			...document.querySelectorAll('footer a')
		],
		classes: {
			match: 'is-current',
			root: 'is-current-root',
			parent: 'is-current-parent'
		},
		onExit() {},
		onEnter() {}
	},

	/***
	 * chunks
	 *
	 * @property :chunks : dynamic import of modules - function used by the loader
	 *
	 */
	chunks: behaviour => import(`@/behaviours/${behaviour}`)
}).mount()
```

### Routes array

The routes array is used to match urls with page transitions

This is the default:

```javascript
const defaultRoutes = [
	{
		path: '/',
		view: {}
	},
	{
		path: '*',
		view: {}
	}
]
```

If you’re on the home page it’s going to match the the object with the ‘/‘ path. Any other url will fallback to the ‘\*’ object

Let’s add a home page transition…

```javascript
import FancyAnimation from 'made-up-animation-lib'

// create an object with the following keys:
const homePage = {
	// this will be called when leaving the home page
	// the next() prop MUST BE CALLED
	onExit({ next, ...props }) {
		console.log(props) // lots and lots of stuff
		FancyAnimation.dance({
			onComplete: () {
				next()
			}
		})
	},

	// this will be called when entering the home page
	// it will not be called on load
	// the next() prop MUST BE CALLED
	onEnter({ next, ...props }) {
		console.log(props) // lots and lots of stuff
		next()
	},

	// this will only be called on the inital load
	onLoad() {
		console.log('Home page onload')
	}
}


const defaultRoutes = [
	{
		path: '/',
		view: homePage,
		name: 'home-page' // could be useful
	},
	{
		path: '*',
		view: {},
		name: 'other-page' // could be useful
	}
]
```

### Transition lifecycle

There are a number of other methods that you can use that are called during the lifecycle of the page transition.

Each method is passed a props object that contains lots of useful things… checkout the console.

#### onLoad

`onLoad(props) :void`

Called once on the initial load

#### shouldUnmount

`shouldUnmount(props) :boolean`

Called before updateDom()
By default this returns true. If it returns false the data behaviours will not be destroyed

#### shouldMount

`shouldMount(props) :boolean`

Called after updateDom()
By default this returns true. If it returns false the data behaviours will not be mounted

#### updateDom

`updateDom(props) :void`

This is called after onExit and onAfterExit

By default. This is the method that removes the old Dom and injects the new one.

```javascript
updateDom({ wrapper, newHtml, title }) {
	wrapper.innerHTML = ''
	wrapper.appendChild(newHtml)
	document.title = title
}
```

#### onExit

`onExit(props): Promise`

Called when a page request has been made.  
The props object has a next property that **must** be used to resolve the promise

#### onAfterExit

`onAfterExit(props) :void`
Called after the Ajax request has resolved and the onExit method has resolved

#### onEnter

`onEnter(props): Promise`

Called after updateDom and onAfterExit
The props object has a next property that **must** be used to resolve the promise

#### onAfterEnter

`onAfterEnter(props) :void`
Called after onEnter has resolved

### Routes array… part 2

Let’s add a some more routes…

```javascript
export default [
	{
		path: '/',
		view: {}
	},
	{
		path: '/about/',
		view: {},
		children: {
			path: ':id',
			view: {},
			name: 'dyanmic'
		}
	},
	{
		path: '*',
		view: {}
	}
]
```

2 new transitons…

The about page _about_
And then any child page… woot

More… I want to add a specific route to one of those child pages…
Let’s change the children object into an array.

```javascript
export default [
	{
		path: '/',
		view: {}
	},
	{
		path: '/about/',
		view: {},
		children: [
			{
				path: ':id',
				view: {},
				name: 'dyanmic'
			},
			{
				path: '/team/',
				view: {},
				name: 'team'
			}
		]
	},
	{
		path: '*',
		view: {}
	}
]
```

Now \_about_team/ will get it’s own transition… more woot

How about a blog… with some pagination

```javascript
import paginationExample from '@/views/loaders/pagination'

export default [
	// saving the trees, removed some example code
	{
		path: '/blog/',
		view: {},
		options: {
			paginationParent: true
		},
		children: [
			{
				path: /(p)+(\d+)/,
				name: 'pagination',

				view: {
					...paginationExample
				},
				options: {
					pagination: true
				}
			},
			{
				path: ':id',
				name: 'post',
				view: {},
				options: {}
			}
		]
	}
]
```

Now… blog_p2 will have one transition, and blog_any-other-slug will have another transition…

And you can nest… for ever… but you probably won’t

```javascript
import paginationExample from '@/views/loaders/pagination'

export default [
	// saving the trees, removed some example code
	{
		path: '/example/',
		view: {},
		options: {
			paginationParent: true
		},
		children: [
			{
				path: '/level2/',
				children: [
					{
						path: '/level3/',
						children: [] // and so on and on and on
					}
				]
			}
		]
	}
]
```

### Events

These are all the events that are fired from the router…
When they are emitted should be fairly clear

```javascript
'ROUTER_POP_EVENT'
'ROUTER_POP_EVENT'
'ROUTE_LINK_CLICKED'
'ROUTE_TRANSITION_LOAD'
'ROUTE_TRANSITION_EXIT'
'ROUTE_TRANSITION_RESOLVED'
'ROUTE_TRANSITION_BEFORE_DOM_UPDATE'
'ROUTE_TRANSITION_AFTER_DOM_UPDATE'
'ROUTE_TRANSITION_ENTER'
'ROUTE_TRANSITION_COMPLETE'

//

eventBus.on('ROUTER_POP_EVENT', () => {})
```

And that’s 90% of the router stuff…
