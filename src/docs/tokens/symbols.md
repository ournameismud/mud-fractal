---
title: "Symbols"
label: "Symbols"
---

{% for name in symbols.symbols -%}
	<div>
		<i class="icon icon--{{ name }}">
			<svg>
				<use class="no-barba" xlink:href="http://localhost:3000/dist/images/svg-symbols.svg#{{ name }}"></use>
			</svg>
		</i>
	</div>
{% endfor -%}
