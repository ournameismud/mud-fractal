---
title: "Symbols"
label: "Symbols"
---

<div class="sym-grid">
	{% for name in symbols.symbols -%}
		<div class="sym-item">
			<i class="icon icon--{{ name }}">
				<svg>
					<use class="no-barba" xlink:href="http://localhost:3000/dist/images/svg-symbols.svg#{{ name }}"></use>
				</svg>
			</i>
			<span>{{ name }}</span>
		</div>
	{% endfor -%}
</div>

### Twig macro

```
[[ h.symbol('ui-facebook') ]] /* but with braces */
```

### HTML snippet

```
<i class="icon icon--ui-facebook">
	<svg>
		<use class="no-barba" xlink:href="#ui-facebook"></use>
	</svg>
</i>
```

### Generated SCSS block

```
.icon {
	position: relative;
	display: block;
	max-width: 100%;

  & > svg {
		position: absolute;
		width: 100%;
		max-width: 100%;
		height: 100%;
		display: block;
		fill: currentColor;
  }

  &:after {
    content: "";
    display: block;
    height: 0; 
    width: auto;
  }
}

.icon--ui-facebook {
  width: 48px;
  &:after {
    padding-bottom: 100%;
  }
}
```

