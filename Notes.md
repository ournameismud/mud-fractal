# Mud-Fractal
[Overview | Mud-Fractal](http://pensive-williams-a0c767.netlify.com/)

## Workflow

Clone/Download [GitHub - ournameismud/mud-fractal: Fractal/Mudstone Frontend Boilerplate](https://github.com/ournameismud/mud-fractal)  and install all the dependencies.

`yarn install`

### Tailwind config
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

### Immutable css

  `.text-red`  is never going to change… ever... it will always make the element it’s applied to red*

When debugging, editing, changing components, you have absolute certainty the impact of your change.

If I removed the  `text-red` class from the button, I can be certain that I have not changed any other component… whereas if I removed `.text-red` from the second version, I can’t be sure how many things I’ve changed.

BEM isn’t going anywhere… It will happily play alongside `functional` css, there will just be much less of it, no more: 

```
.card__profile--small-with-little-extra-nudge {
	.padding-left: 2px // bloody designers
}
```


*it’s css so… you know

## Fractal
Start the fractal server

`npm start`

Make a component, object, global or page template, 

Absolute minimum is a twig file
`/src/templates/04-components/demo/demo.twig`

Add some css

`/src/templates/04-components/demo/_demo.scss`

The main style is setup to fetch files from the templates directory.



