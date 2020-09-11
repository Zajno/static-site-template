# Static Site Template

Basic template for static sites to be built with TypeScript, HTML, SASS.
Just a compilation of commonly used approaches and utilities in projects we made.

Uses Webpack, Babel, GSAP.

Includes an infrastructure for DOM management via code – Pages, Sections, various modules and components:

* Lottie animation wrapper
* Canvas – as an example of how to organize canvas rendering
* Tabs – manage tabs inside a section
* SvgMorph – manages svg:path animation via GSAP
* Video – manages video element playback, with optional placeholder
* Image and videos lazy loading
* Basic forms validation and submission

Prepared for:
* in-view animation or interactivity
* replace favicon depdending on browser color scheme (dark/light)
* custom cursor
* custom scroll
* placeholder for non supported browsers
* mobile menu
* sticky header
* styles organization – responsive, colors, typography
* some other easy effects (like linear gradient animation)

### Responsive

GEM system for CSS: built on top of `rem`s, allows to scale up or down when using `gem` sizes. See [rem.scss]('./app/styles/common/rem.scss) for more details.

Code breakpoints: allows to change beahaviour whenever breakpoint changes.

## Build project

Requirements: [Node.js ^12](https://nodejs.org/), [yarn](https://classic.yarnpkg.com/lang/en/)

Output folder: `./dist`

```bash
yarn
yarn build
```

or fully minified and compressed:

```bash
yarn build:prod:minify:env
```

## Run project

Using webpack dev server

```bash
yarn dev
```

Also this project provides trivial Node.js app that just serves static files, additionally with:

* gzip compression
* http -> https redirection
* basic 404 support
* cache management
* uses `./dist` as a root

Build and start it:

```bash
yarn start
```
