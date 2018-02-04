---
title: "Padding"
label: "Padding"
---

{% for key, value in padding %}

<div class="p-{{ key }} bg-black text-white">
  key: p?-{{ key }}  value: {{ value }}
</div>

{% endfor %}
