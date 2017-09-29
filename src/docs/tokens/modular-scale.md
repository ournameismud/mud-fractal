---
title: "Modular Scale"
label: "Modular Scale"
---


{% for i in range(-2, 20) -%}
	<div class="token-grid">
		<div class="token-grid__thumb">ms({{ i }})</div>
		<div class="token-grid__info fs--{{ i }}">Nostrud tempore justo eros pellentesque tristique, etiam incidunt bibendum mollis placeat quo. Turpis risus modi assumenda. Potenti praesent, libero! Dis recusandae tristique, esse, lorem pariatur.</div>
	</div>
{%- endfor %}
