---
hidden: false
title: Mudstone front-end component library
---
You are viewing the front-end component library for Domus.

## Project Structure

### Core files

- `src/scss` All base styles, grid, typography, scss variables/mixins/functions
- `src/js` Core javascript, utilities, behaviour loader (see Javascript notes)
- `src/fonts` All of the webfonts
- `src/images/site` Placeholder images (jpgs, pngs, svgs)
- `src/images/svg-symbols` Icons, these are converted into svg symbols

### Pattern library files

All of the html, css for specific pattern components can be found in `src/library`. Eg:

- `src/templates/03-global/header/header.twig`
- `src/templates/03-global/header/_header.scss`

## Component categories

* **Objects:** Small, reusable, and single purposes modules
* **Components:** Reusable components, could be comprised of several modules
* **Global:** Components that appear on every page on the site
* **Layouts:** Components concerned with macro layout
* **Templates:** Templates for particular page types
