# The ultimate generator for UI5

![Open UI5 Logo](https://openui5.org/images/OpenUI5_new_big_side.png)

[![CircleCI](https://circleci.com/gh/ui5-next/ui5g.svg?style=shield)](https://circleci.com/gh/ui5-next/ui5g)
[![npm version](https://badge.fury.io/js/generator-ui5g.svg)](https://www.npmjs.com/package/generator-ui5g)

The ultimate generator for OpenUI5/SAPUI5, provide the next generation syntax for UI5 envrionment.

## Features

* Most ES6 & Typescript syntax support. (powered by [babel-preset-ui5-next](https://github.com/ui5-next/babel-preset-ui5-next))
* Full module system mapping. (powered by [babel-preset-ui5-next](https://github.com/ui5-next/babel-preset-ui5-next))
* Smart `preload.js` file. (powered by [gulp-ui5-eager-preload-plugin](https://github.com/Soontao/gulp-ui5-eager-preload))
* React `JSX` syntax support. (powered by [babel-preset-ui5-next](https://github.com/ui5-next/babel-preset-ui5-next))
* Import npm libraries. (powered by [gulp-ui5-eager-preload-plugin](https://github.com/Soontao/gulp-ui5-eager-preload))
* VSCode auto import support. (powered by [@ui5-next/types](https://github.com/ui5-next/types))
* Pre-defined `vscode`, `eslint`, `babel`, and `gulp` config
* Electron support.
* Cordova (Experimental) support.

## Example Project

[UI5 To Do](https://github.com/ui5-next/ui5-todo) is a sample project built on the next generation UI5 technical. It contains: 

* es6 modules
* jsx syntax
* using npm module
* redux integration. (so that user can inspect model by [redux devtools](https://github.com/zalmoxisus/redux-devtools-extension))
* reactive programming
* no controller & view

features.

## Installation

Firstly, install [Yeoman](http://yeoman.io) and generator-ui5g using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)). [Here](https://github.com/Soontao/ui5g-generate-proj) is a generated sample app

```bash
npm i -g yo generator-ui5g
```

## Generate Project

Run `yo ui5g` to generate your own project.

The project will be generated in a `new` folder, and the folder name is same as app name.

Also, dependencies will be auto installed by `npm`

## Development

start your development, this command will open ui5 application by `BrowserSync`

```bash
npm start
```

## Build

```bash
npm run build
```

## Configuration

* ```babel```, edit ```.babelrc``` to modify babel behavior, for example, make sourcemaps inline

* ```eslint```, edit ```.eslintrc``` to modify eslint lint config, by default, new project will use most rules of ui5 standard, only add es6 and other essential rules.

* ```gulp```, edit ```gulpfile.js``` to modify gulp task and other task behavior, you can add *sass* or *uglify* or other processes manually, or adjust *src*/*dist* directory

* ```proxy```, edit ```proxies.js```, supported by gulp connect, use a traditional node lib, it can set local proxy to remote server

## Command

* ```npm start```, default *gulp* will start a hot reload server, based on BrowserSync. Recommended to develop in this way.
  
* ```npm run build```, build files to *dist* directory, and ```Component-preload.js``` will be created.

## [CHANGELOG](./CHANGELOG.md)

## About

This generator is written by `Theo` but some ideas come from `Madeleine`.

The idea of `JSX Support` is from `Kenny`, just a syntactic sugar.

Very pleased to be able to help you.
