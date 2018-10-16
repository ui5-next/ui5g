'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const path = require('path');
const process = require('process');
const mkdirp = require('mkdirp');

module.exports = class extends Generator {
  async prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the ' + chalk.red('generator-ui5g') + ' generator!'
    ));

    const prompts = [{
      type: 'input',
      name: 'name',
      message: 'App name',
      default: 'ui5-workthrough'
    }, {
      type: 'input',
      name: 'namespace',
      message: 'App namespace',
      default: 'ui5.demo.walkthrough'
    },
    {
      type: 'list',
      name: 'ui5Domain',
      message: 'SAPUI5 or OpenUI5?',
      choices: [{
        name: 'OpenUI5',
        value: 'openui5.hana.ondemand.com'
      }, {
        name: 'SAPUI5',
        value: 'sapui5.hana.ondemand.com'
      }]
    }];

    const props = await this.prompt(prompts);
    props.dir = props.name.replace(/[^a-zA-Z]/g, '');
    props.namepath = props.namespace.replace(/\./g, '/');
    this.props = props;
  }

  writing() {
    const targetPathRoot = path.join(process.cwd(), this.props.dir);
    mkdirp(targetPathRoot, () => {
      this.fs.copyTpl(this.templatePath(), this.destinationRoot(targetPathRoot), this.props);
      this.fs.copyTpl(this.templatePath('.*'), this.destinationRoot(targetPathRoot), this.props);
      this.fs.copy(this.templatePath('.vscode/**'), this.destinationRoot(path.join(targetPathRoot, '.vscode')), this.props);
    });
  }

  installing() {
    this.npmInstall();
  }
};
