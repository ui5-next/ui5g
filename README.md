# generator-ui5g

[![npm version](https://badge.fury.io/js/generator-ui5g.svg)](https://www.npmjs.com/package/generator-ui5g)

Enhanced generator for sapui5/openui5, with gulp

## TO-DO

* webpack support
* commit check
* auto import support based on openui5 type
* inline thirdparty library

## feature

* full ES6 feat support
* compile to ui5 code
* preload file support
* eslint

## Installation

Firstly, install [Yeoman](http://yeoman.io) and generator-ui5g using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)). [Here](https://github.com/Soontao/ui5g-generate-proj) is a generated sample app

```bash
npm i -g yo generator-ui5g
```

## Generate Project

Then generate your new project:

```bash
# --- mk your project directory manually
mkdir sample-project
cd sample-project
# --- start generate
yo ui5g
# --- three questions
? App name
? App namespace
? SAPUI5 or OpenUI5?
# --- use openui5 if you dont know what is sapui5
```

****

and install dependencies

```bash
yarn
# or
npm i
```

## Dev

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

Very pleased to be able to help you.
