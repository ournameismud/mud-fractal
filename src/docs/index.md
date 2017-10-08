---
hidden: true
title: Overview
---
You are viewing the front-end component library for {{ title }}

## Project Structure

### Core files

- `src/scss` All base styles, grid, typography, scss variables/mixins/functions
- `src/js` Core javascript, utilities, behaviour loader (see Javascript notes)
- `src/fonts` All of the webfonts
- `src/images/site` Placeholder images (jpgs, pngs, svgs)
- `src/images/svg-symbols` Icons, these are converted into svg symbols

### Pattern library files

All of the html, css for specific pattern components can be found in `src/templates`. Eg:

- `src/templates/03-global/header/header.twig`
- `src/templates/03-global/header/_header.scss`

## Component categories

* **Base:** Typography, themes, base styles
* **Objects:** Small, reusable, and single purposes modules
* **Components:** Reusable components, could be comprised of several modules
* **Global:** Components that appear on every page on the site
* **Layouts:** Components concerned with macro layout
* **Pages:** Templates for particular page types
