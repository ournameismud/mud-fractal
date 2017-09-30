---
title: Javascript
---

### Data Behaviours

All javascript behaviours are intialized via a `data-behaviour` attribute 

For Example
```
<div data-behaviour="MainMenu"></div>
```

Each data-behaviour instantiates a new constructor function which extends a Behaviour class.  All data behaviours should be camel case and start with a capital letter, following the naming convention used for constructor functions (http://javascript.crockford.com/code.html#names)

Each data-behaviour should be exported as a named function

- `src/js/behaviours/Menu.js`
```
export class Menu extends Behaviour {}
```

Each data-behaviour is exported from the behaviours index file 


- `src/js/behaviours/index.js`
```
export { Menu } from './Menu'
```

Each data-behaviour is then imported into `app.js` and passed into the `App` constructor

