# The ultimate generator for UI5

![](https://openui5.org/images/OpenUI5_new_big_side.png)

[![npm version](https://badge.fury.io/js/generator-ui5g.svg)](https://www.npmjs.com/package/generator-ui5g)

The ultimate generator for UI5, provide the next generation syntax for UI5 envrionment.

## [CHANGELOG](./CHANGELOG.md)

## TO-DO

* Auto import support based on UI5 Type
* Thirdparty library support
* Fragment Support
* Convert react components to UI5 control 

## Features

* Full ES6 feat support
* Full module system mapping
* React `JSX` syntax support
* Full compile to ui5 code
* `Component-preload` file
* Predefined `vscode`, `eslint`, `babel` and `gulp` config

## Limitation

* Just a complier, not a runtime
* Can't generated `bundle.js` file as `React` or `Vue`, but you can generate `Component-preload.js`, sometimes they are equivalent
* With JSX syntax, but not support `React` component lifecycle. 

## Why not support react lifecycle and virtual dom ?

* UI5 `Controls` (Components in the modern sense) have its' own lifecycle, and can not overwrite them.
* UI5 `Renderers` normally write `DOM` directly, but react `render` function just return a data object. That's the core of virtual dom.
* Its hard to convert `model` in MVC to `react` one-way data binding. I think `vue` will be better choice because its `two-way-binding`, but vue's template syntax is complex.
* Additional performance overhead, and additional in-stability.

But I think converting `React Component` to UI5 Control is feasible and meaningful.

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
          // extra will passed in HelloPanel internal
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

## Configuration

* ```babel```, edit ```.babelrc``` to modify babel behavior, for example, make sourcemap inline

* ```eslint```, edit ```.eslintrc``` to modify eslint lint config, by default, new project will use most rules of ui5 standard, only add es6 and other essential rules.

* ```gulp```, edit ```gulpfile.js``` to modify gulp task and other task behavior, you can add *sass* or *uglify* or other processes manually, or adjust *src*/*dist* directory

* ```proxy```, edit ```proxies.js```, supported by gulp connect, use a tranditional node lib, it can set local proxy to remote server

## Command

* ```npm start```, default *gulp* will start a hot reload server, based on BrowserSync.
  
  PLEASE NOTE THAT: ALL COMPILED FILES ARE STORAGE IN MEMORY WHEN DEVELOPING
  
* ```npm run build```, build files to *dist* directory, and ```Component-preload.js``` will be created.

## About

This generator is written by `Theo` but some ideas come from `Madeleine`, and it only can generate really simple project.

The idea of `JSX Support` is from `Kenny`, just a syntactic sugar.

Very pleased to be able to help you.
