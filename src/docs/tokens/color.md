---
title: "Colour"
label: "Color"
---

## Colour Palettes


{% for palette, values in colors %}
**{{ palette | capitalize }}** palette values.  Access via scss function `c({{ palette }}, name)`
	{% for key, value in values -%}
		<div class="token-grid">
			<div class="token-grid__thumb" style="background-color: {{ value }}"></div>
			<div class="token-grid__info">{{ key }} | {{ value }}</div>
		</div>
  {% endfor -%}
{% endfor %}
