---
title: "Colour"
label: "Color"
---

## Colour Palettes

{% for palette, values in colors %}

<div class="bg-{{ palette }} flex items-center justify-center" style="width: 100px; height: 100px; border-radius: 100%">
	{{ palette }}
</div>
{% endfor %}
