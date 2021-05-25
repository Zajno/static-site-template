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


## Dependencies

This package depends on some polyfills packages and helpers like `reset-css` and `detect-browser` which are either required or doesn't affect bundle size much.

Significant dependencies are:

* [GSAP](https://greensock.com/gsap/) – doesn't need introduction; 'member' version is used in this project
* [Lottie](https://airbnb.io/lottie/#/) – for stunning SVG animations; see wrapper [`LottieComponent`](./app/scripts/components/common/lottie.ts)
* [@zajno/common](https://github.com/Zajno/common-utils) – Zajno's custom toolbox with useful utils & helpers.


## Responsiveness

GEM system for CSS: built on top of `rem`s, allows to scale up or down when using `gem` sizes. See [rem.scss](app/styles/common/rem.scss) for more details.

Code breakpoints: allows to change behavior whenever breakpoint changes.

## Pages & Sitemap

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

### Creating a new page

#### 1. Create a Markup Template file.

 This project uses `EJS` template files. Basically `.ejs` it's a `.html` file with a support of build-time run JS snippets. Those snippets are run in `webpack` and `HtmlWebpackPlugin` context. They use `underscore`-like syntax:

```html
<!-- in ejs: -->
<span> <%= 2+3 %> </span>
<!-- will output: -->
<span> 5 </span>
```

Template syntax is mostly used to get page's info from the Sitemap. This allows to decouple page markup and data used in there. This way, the same template file can serve as a markup source for multiple pages, like in case of `i18n` support or dynamically generated data.

Create a template file based on the pattern used in `app/html/index.ejs`

#### 2. Define an Entry Point

Usually in webpack, entry point is a JS/TS file that imports all necessary assets and runs run-time scripts.
Thanks to webpack 5, now there may be multiple entry points including style files. So now there're few options to define an entry point for a page:

* single or few TS files
* combine styles and code files
* single or few style files

Currently Sitemap contains few examples of how an entry point can be defined:

* `Home`: just one TS file which imports necessary styles and runs the code.
* `Page404`: two style files (order matters)
* `NotSupported`: default stub entry point - no code or styles are needed

For convenience there is a stub entry point if you don't need neither code or styles: `app/scripts/index.ts`.


#### 3. Export your Page object

Create and export a new object of `SitePage` type in `app/sitemap/pages.ts`; don't forget to include the new template file and entry point in it, and update all other fields for this page correspondingly.

#### i18n

The idea behind i18n implementation is to:

* keep all pages content (such as copyright) in a separate files (`sitemap/copyright`)
* declare all pages and their localized alternative in a sitemap (`sitemap/pages.ts`)
* each page can have localized alternatives by having a template with few additional objects containing copyright or any other content variations
* according to the configs above generate proper output html pages
* optionally, set up Firebase Hosting `i18n` feature so it can rewrite a request to correct localized file based on client's Accept-Language header.

Using this way, it's possible to update content such as copyright but not touching the code (html/js) itself. This can be extended to/replaced with a remote CMS service – because the main idea is to keep separately thing that can be changed often.

In theory, a non-developer person such as content editor can go to Github web interface, find a corresponding file, replace some strings in there, create and merge a PR and hopefully deploy the update without developers involvement.

## More about the run-time

This project template assumes some certain run-time patterns will be used, so here they are.

### Scripts

By default there's no limitation on how the run-time scripts should work. But the main method we're using is a base Page class. There's a very basic example on how to use it in the [HomePage](./app/scripts/pages/homePage.ts) file.

The [Page](./app/scripts/core/page.ts) class is responsible for:

* Find the `main` tag and provide it as a root
* Collect all `section` tags and:
    * create instances with corresponding classes via abstract `sectionTypes`
    * enable/disable section on page scroll
    * propagate page events like scroll, resize
* Manage and update AppBreakpoints on page resize

To have a custom section code one can define it via `sectionTypes` in the derived Page, where a custom class will be created then in linked to the corresponding `section` tag. Otherwise, one can just place a default empty [`Section`](./app/scripts/core/section.ts) which will do nothing.

### Styles

There's a [base stylesheet](./app/styles/base.sass) that includes colors, typography, common styles and responsive settings for the project.

It's highly recommended to import it separately in scripts or entry points to allow them to be splitted as a separate file.

It's possible to inline styles manually when an entry point contains some, and ejs template has `@inline css here@` placeholder. For now, all css for the entry point will be included.

### webpack Split chunks

Currently it's configured to split chunks by their re-usage disregarding chunk size. It was a painful experience to try to set up min/max chunk size, so we've left it as it is.

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
