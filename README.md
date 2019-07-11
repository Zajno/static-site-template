# Static Site Template

## Requirements

Node.js ^10 || 12^

https://nodejs.org/

## Install

Install yarn:

```bash
npm i -g yarn
```

Install packages

```bash
yarn
```

## Build project

Output folder: `./dist`

```bash
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

Or start Node.js that will use `./dist` as root

```bash
yarn start
```
