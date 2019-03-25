# The ultimate generator for UI5

![Open UI5 Logo](https://openui5.org/images/OpenUI5_new_big_side.png)

[![npm version](https://badge.fury.io/js/generator-ui5g.svg)](https://www.npmjs.com/package/generator-ui5g)

The ultimate generator for OpenUI5/SAPUI5, provide the next generation syntax for UI5 envrionment.

## Features

* Full ES6 syntax support. (powered by [babel-preset-ui5-next](https://github.com/ui5-next/babel-preset-ui5-next))
* Full module system mapping. (powered by [babel-preset-ui5-next](https://github.com/ui5-next/babel-preset-ui5-next))
* Eager `preload.js` file. (powered by [gulp ui5 eager preload plugin](https://github.com/Soontao/gulp-ui5-eager-preload))
* React `JSX` syntax support. (powered by [babel-preset-ui5-next](https://github.com/ui5-next/babel-preset-ui5-next))
* Allowed import third party libraries from `node_modules`. (powered by [gulp ui5 eager preload plugin](https://github.com/Soontao/gulp-ui5-eager-preload))
* VSCode auto import support. (powered by [@ui5-next/types](https://github.com/ui5-next/types))
* Pre-defined `vscode`, `eslint`, `babel`, and `gulp` config

## A sample view file syntax

Developer can use JSX element in JSView defination & and no need to write additional controllers.

(But developers can still use a custom controller by writing `getControllerName()`)

Source Code:

```jsx
import JSView from "sap/ui/core/mvc/JSView";
import Page from "sap/m/Page";
import Button from "sap/m/Button";
import HelloPanel from "./HelloPanel.view"; // another js view
import InvoiceList from "./InvoiceList.view"; // another js view

export default class App extends JSView {

  createContent(controller) {
    this.addStyleClass(controller.getOwnerComponent().getContentDensityClass());
    // yes, JSX support
    return (
      <Page
        headerContent={
          <Button
            icon="sap-icon://hello-world"
            press={() => {
              this.oController.getOwnerComponent().openHelloDialog();
            }}
          />
        }
      >
        {
          // extra will be passed into HelloPanel
          // and use this.getViewData().extra to get it
        }
        <HelloPanel extra="this_is_a_test_string" />
        <InvoiceList />
      </Page>
    );
  }

}
```

and it works

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

This template is based on [UI5 Walkthrough](https://sapui5.hana.ondemand.com/test-resources/sap/m/demokit/tutorial/walkthrough/37/webapp/test/mockServer.html?sap-ui-theme=sap_belize), It contains most features of ui5

start your project

```bash
npm start
```

## Build

Please run

```bash
npm run build
```

to generate webpack bundle, resources maybe lost, remember to check `webpack.config.js` if you meet 404 code

## Configuration

* ```babel```, edit ```.babelrc``` to modify babel behavior, for example, make sourcemap inline

* ```eslint```, edit ```.eslintrc``` to modify eslint lint config, by default, new project will use most rules of ui5 standard, only add es6 and other essential rules.

* ```gulp```, edit ```gulpfile.js``` to modify gulp task and other task behavior, you can add *sass* or *uglify* or other processes manually, or adjust *src*/*dist* directory

* ```proxy```, edit ```proxies.js```, supported by gulp connect, use a tranditional node lib, it can set local proxy to remote server

## Command

* ```npm start```, default *gulp* will start a hot reload server, based on BrowserSync. Recommended to develop in this way.
  
  PLEASE NOTE THAT: ALL COMPILED FILES ARE STORAGE IN MEMORY WHEN DEVELOPING
  
* ```npm run build```, build files to *dist* directory, and ```Component-preload.js``` will be created.

* ```npm run bundle```, generate `webpack` bundle file & copy necessary files.

## Why support JSX syntax but not support react lifecycle and virtual dom

* UI5 `Controls` (Components in the modern sense) have its' own lifecycle, and can not overwrite them.
* UI5 `Renderers` normally write `DOM` directly, but react `render` function just return a data object. That's the core of virtual dom.
* Its hard to convert `model` in MVC to `react` one-way data binding. I think `vue` will be better choice because its `two-way-binding`, but vue's template syntax is complex.
* Additional performance overhead, and additional in-stability.

But I think converting `React Component` to UI5 Control is feasible and meaningful.

## TO-DO

* More templates support

## [CHANGELOG](./CHANGELOG.md)

## About

This generator is written by `Theo` but some ideas come from `Madeleine`, and it only can generate really simple project.

The idea of `JSX Support` is from `Kenny`, just a syntactic sugar.

Very pleased to be able to help you.
