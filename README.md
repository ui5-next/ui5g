# generator-ui5g 

Basic generator for sapui5/openui5, with gulp

## Installation

First, install [Yeoman](http://yeoman.io) and generator-ui5g using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)). [Here](https://github.com/Soontao/ui5g-generate-proj) is a generated app

```bash
npm install -g yo
npm install -g generator-ui5g
# or
yarn global add yo
yarn global add generator-ui5g
```

## Generate Project

Then generate your new project:

```bash
# yes you have to mk your project directory manually
mkdir sample-project
cd sample-project
yo ui5g
# it will ask your 3 questions
# please make sure your answer is logical, because generator not process empty or wrong input error
? App name theo1
? App namespace corp.sap.msms.theo
# PLEASE CHOOSE OpenUI5 IF YOU DONT HAVE SAPUI5 LINCENSE
? SAPUI5 or OpenUI5? OpenUI5
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
yarn run dev
# or
npm run dev
```

## Configuration

* ```Babel```, edit ```.babelrc``` to modify babel behavior, for example, make sourcemap inline

* ```ESLint```, edit ```.eslintrc``` to modify eslint lint config, by default, new project will use most rules of ui5 standard, only add es6 and other essential rules.

* ```gulp```, edit ```gulpfile.js``` to modify gulp task and other task behavior, you can add *sass* or *uglify* or other processes manually, or adjust *src*/*dist* directory

* ```proxy```, edit ```proxies.js```, supported by gulp connect, use a tranditional node lib, it can set local proxy to remote server

## Command

* ```gulp```, default *gulp* will start a hot refresh server, watch file change and refresh browser when your codes change.
* ```gulp lint```, use *eslint* to auto fix your code.
* ```gulp build```, delete *dist* directory and build es6 codes to es5, and compile less to css.

## About

This generator is written by Theo but some ideas come from Madeleine, and it only can generate really simple project.

Very pleased to be able to help you.