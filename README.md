# Static Site Template

Basic template for static sites to be built with TypeScript, HTML, SASS.
Just a compilation of commonly used approaches and utilities in projects we made.

Uses Typescript, Webpack, Babel, GSAP.

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
* replace favicon depending on browser color scheme (dark/light)
* custom cursor
* custom scroll
* placeholder for non supported browsers
* mobile menu
* sticky header
* styles organization – responsive, colors, typography
* some other easy effects (like linear gradient animation)

### Responsiveness

GEM system for CSS: built on top of `rem`s, allows to scale up or down when using `gem` sizes. See [rem.scss](app/styles/common/rem.scss) for more details.

Code breakpoints: allows to change beahaviour whenever breakpoint changes.

### Dependencies

This package depends on some polyfills packages and helpers like `reset-css` and `detect-browser` which are either required or doesn't affect bundle size much.

Significant dependencies are:

* [GSAP](https://greensock.com/gsap/) – doesn't need introduction; 'member' version is used in this project
* [Lottie](https://airbnb.io/lottie/#/) – for stunning SVG animations; see wrapper [`LottieComponent`](./app/scripts/components/common/lottie.ts)
* [@zajno/common](https://github.com/Zajno/common-utils) – Zajno's custom toolbox with useful utils & helpers.

#### `@zajno/*` packages

This project uses some of Zajno's helper public projects (`@zajno/*`). For now they're hosted on Github and it's required to be authenticated with it.

1. Get your Github token or create a new one: https://github.com/settings/tokens/new – it should have at least `read:packages` permission.
2. Use it to tell NPM how to communicate with GH:

```bash
npm set //npm.pkg.github.com/:_authToken <YOUR_TOKEN>
```

Link: https://stackoverflow.com/a/58271202/9053142

### Pages

Pages are manages via Sitemap. This build-time module aimed to generate corresponding output for each configured page, including:

* html, js, css
* head meta tags
* separately configurable copyright/data
* i18n page versions (see below)
* `sitemap.xml` file

Every page has a config, all pages configs are stored in the `app/sitemap/pages.ts` module. There are some sample pages for a reference, but the most important properties of a page are:

* `id`: unique page identifier; useful mostly for the build-time.
* `entryPoint`: path to a TS/JS file that will be included to the page; may contain all necessary front-end logic.
* `templateName`: `ejs` or `html` template file that will be processed by HtmlWebpackPlugin.
* `output`: all necessary output date related to a page version
    * `path`: output filename
    * `href`: URL pathname that may be used to reference this page
    * `title`: HTML head title tag content
    * `description`: OG/Twitter meta tags description
    * `image`: OG image path relative to `./app/assets/img/og-image`
    * `locale`: ISO 639-1 language code associated with the current output, e.g. `en`, `ja`, `ko`
    * `copy`: object with the copyright data (i18n aware) that will be passed to the template engine
* `i18n`: optional array of the page versions with different locales, each element is the same shape of `output`.

To add a page:

1. Create a template file based on the pattern used in `app/html/index.ejs`
2. Create a new script entry point; or use a stub one: `app/scripts/index.ts`
2. Create and export a new object of `SitePage` type in `app/sitemap/pages.ts`; reference there the new template file and entry point from above and update all other fields for this page correspondingly.

### i18n

The idea behind i18n implementation is to:

* keep all pages content (such as copyright) in a separate files (`sitemap/copyright`)
* declare all pages and their localized alternative in a sitemap (`sitemap/pages.ts`)
* each page can have localized alternatives by having a template with few additional objects containing copyright or any other content variations
* according to the configs above generate proper output html pages
* optionally, set up Firebase Hosting `i18n` feature so it can rewrite a request to correct localized file based on client's Accept-Language header.

Using this way, it's possible to update content such as copyright but not touching the code (html/js) itself. This can be extended to/replaced with a remote CMS service – because the main idea is to keep separately thing that can be changed often.

In theory, a non-developer person such as content editor can go to Github web interface, find a corresponding file, replace some strings in there, create and merge a PR and hopefully deploy the update without developers involvement.


## Build project

Requirements: [Node.js ^14](https://nodejs.org/), [yarn](https://classic.yarnpkg.com/lang/en/)

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

### Firebase Hosting

Project contains [`firebase.json`](firebase.json) with boilerplate settings for Firebase Hosting, which is easy to use both for dev and production.

To use it, fill `.firebaserc` file with your Firebase project name.

Then, to build and deploy – use correspond commands:

```bash
yarn build:release:(staging | production)
yarn deploy:firebase:(staging | production)
```

For automating the CD process, there's a [Github Workflow file](./.github/workflows/deploy-staging.yml) for building & deploying on every push to branch `staging`.
