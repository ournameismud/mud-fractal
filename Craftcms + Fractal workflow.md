# Craftcms + Fractal workflow:
## Frontend
Create **component**, use faker data defined in `componentName.config.js`

```
import faker from 'faker'

module.exports = {
	selector: '.c-teaser',
	title: 'Teaser',
	status: 'ready',
	context: {
		title: faker.lorem.words(num),
		body: faker.lorem.sentence(num)
	}
}
```

or just hardcode content directly into the component - which can then be replaced with twig variables during craft integration

Create a **page** file

If there is data available from craftcms, import the json into `pageName.config.js` like thus:

```
import API from '../../api'

module.exports = {
	context: {
		data: API('my-fancy-page') // url endpoint 
	}
}
```

each `page` template will be supplied with a `data` object that contains all of the required content

```
{% block body %}
	{% include '@hero--slide' with data.hero %}
{% endblock %}
```

If there is no content available from craft then all of the data should be defined on the context.data object

```
module.exports = {
	context: {
		data: {
			hero: {
				heading: 'bla bla'
			}
		}
	}
}
```

Each 'page' template must have the following boilerplate code in it:

```
{% set layout = craft.getHeaders.fetch('x-barba') == 'true' 
  ? "wrapper/_partial" 
  : craft.getHeaders.fetch('X-JSON-Header')
    ? "wrapper/_json"
    : "wrapper/_layout" 
%}
{% set extend = craft is defined ? layout : '@wrapper' %}
{% extends extend %}
{% block critical_css %}
	<!-- build:critical-->
	<!-- endbuild -->
{% endblock %}
{% block body %}
 ...
{% endblock %}
```

## Backend
Prepare all of the craft content, and attach to a data object

```
{% set data = {
		hero: hero,
		blocks: blocks,
		occasion: {
			heading: occasion[0].title,
			body: occasion[0].body,
			date: occasion[0].postDate | date("d F Y")
		}
} %}

{# Requests with a X-JSON-Header header (fractal, frontend code, etc) #}
{% if craft.getHeaders.fetch('X-JSON-Header') == 'true' %} 
	{% header "Content-Type: application/json; charset=utf-8" %}
	{% header "Access-Control-Allow-Origin: *" %}
	{{ data|json_encode() | raw  }}
{% else %}
	{% include '@home' with { data: data } %}
{% endif %}
```

If you change `{% if craft.getHeaders.fetch('X-JSON-Header') == 'true' %} ` to `{% if craft.getHeaders.fetch('X-JSON-Header') != 'true' %} ` then the craft template will just output the data... perfect for preparing the stuff
