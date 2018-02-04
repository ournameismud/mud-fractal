---
title: "Text size"
label: "Text size"
---

## Text Size

{% for key, value in textSizes %}

<div class="text-{{ key }} text-black">
 key: {{ key }} 
 value: {{ value }}
</div>

{% endfor %}
