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

This template is based on [UI5 Workthrough](https://sapui5.hana.ondemand.com/test-resources/sap/m/demokit/tutorial/walkthrough/37/webapp/test/mockServer.html?sap-ui-theme=sap_belize), It contains most features of ui5

start your project

```bash
yarn run dev
# or
npm run dev
```

you can use ```es6/es2015``` features and ```less``` in project, and js sourcemap is open defaultly

you can edit ```proxies.js``` to add more proxy servers

also, ```eslintrc``` works

edit ```.babelrc``` to modify babel config

use ```gulp lint``` to use eslint auto fix your code,

by default, ```gulp build``` will delete ```dist``` directory, and lint all source files

## About

This generator is written by Theo but some ideas come from Madeleine, and it only can generate really simple project. 

Very pleased to be able to help you.