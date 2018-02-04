---
title: "Fonts"
label: "Fonts"
---

## Fonts

{% for font, value in fonts %}

<div class="font-{{ font }} text-2xl">
  {{ value }}
</div>

{% endfor %}
