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

GEM system for CSS: built on top of `rem`s, allows to scale up or down when using `gem` sizes. See [rem.scss](app/styles/common/rem.scss) for more details.

Code breakpoints: allows to change beahaviour whenever breakpoint changes.


### i18n

The idea behind i18n implementation is to:

* keep all pages content (such as copyright) in a separate files (`sitemap/copyright`)
* declare all pages and their localized alternative in a sitemap (`sitemap/pages.ts`)
* each page can have localized alternatives by having a template with few additional objects containing copyright or any other content variations
* according to the configs above generate proper output html pages
* optionally, set up Firebase Hosting's `i18n` feature so it can rewrite a request to correct localized file based on client's Accept-Language header.

Using this way, it's possible to update content such as copyright but not touching the code (html/js) itself. This can be extended to/replaced with a remote CMS service – because the main idea is to keep separately thing that can be changed often.

In theory, a non-developer person such as content editor can go to Github web interface, find a corresponding file, replace some strings in there, create and merge a PR and hopefully deploy the update without developers involvement.


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

### Own hosted

This project provides trivial Node.js app that just serves static files, additionally with:

* gzip compression
* http -> https redirection
* basic 404 support
* cache management
* uses `./dist` as a root

Build and start it:

```bash
yarn start
```

### Firebase Hosting

Project contains [`firebase.json`](firebase.json) with bolerplate settings for Firebase Hosting, which is much easier to use both for dev and production.

To use it, fill `.firebaserc` file with your project name.

Then, to build and deploy – use correspond commands:

```bash
yarn build:release:(staging | production)
yarn deploy:firebase:(staging | production)
```

For automating the CD process, there's a [Github Workflow file](./.github/workflows/deploy-staging.yml) for building & deploying on every push to branch `staging`.
