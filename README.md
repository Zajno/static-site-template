# Static Site Template

## Requirements

Node.js ^8.10 || ^10.7

https://nodejs.org/

## Install

Install yarn:
```
npm i -g yarn
```
Install packages
```
yarn
```

## Build project
Output folder: `./dist`

```
npm run build
```
or fully minified and compressed:

```
npm run build:prod
```

## Run project

Using webpack dev server
```
npm run dev
```
Or start Node.js that will use `./dist` as root
```
npm start
```
