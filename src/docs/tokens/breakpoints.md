---
title: "Breakppints"
label: "Breakppints"
---

Default breakpoints, access via `mq($from: breakpoints('key')){}`

Key         | Value
------------|------------
{% for key, value in breakpoints -%}
`{{ key }}` | {{ value }}
{% endfor -%}
