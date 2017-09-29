---
title: "Fonts"
label: "Fonts"
---

## Font families
Font family tokens are used for typographic styling.  Access via scss function `font(key)` and `weight(key)`

Key         | Value			 																																																| Weight
------------|-----------------------------------------------------------------------------------------------------------|------------
{% for key, value in fonts -%}
`{{ key }}` | <span style="font-size: 1rem; font-family: {{ value['font-family'] | replace('(', '') | replace(')', '') }}; font-weight: {{ value.weight }}">{{ value['font-family'] | replace('(', '') | replace(')', '') }}</span>	| {{ value.weight }}
{% endfor -%}
