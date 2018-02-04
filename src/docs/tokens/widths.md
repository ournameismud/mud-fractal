---
title: "Widths"
label: "Widths"
---

{% for key, value in widths %}

<div class="w-{{ key }} bg-black text-white">
  {{ value }}
</div>

{% endfor %}
