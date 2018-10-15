'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const mkdirp = require('mkdirp');

module.exports = class extends Generator {
  prompting() {
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
      default: 'sap.ui5.demo.walkthrough'
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

    return this.prompt(prompts).then(props => {
      props.namepath = props.namespace.replace(/\./g, '/');
      this.props = props;
    });
  }

  writing() {
    this.fs.copyTpl(this.templatePath(), this.destinationRoot(), this.props);
    // this.fs.copyTpl(this.templatePath('*'), this.destinationRoot(), this.props);
    this.fs.copyTpl(this.templatePath('.*'), this.destinationRoot(), this.props);
    // this.fs.copy(this.templatePath('build/**'), this.destinationRoot('build'), this.props);
    this.fs.copy(this.templatePath('.vscode/**'), this.destinationRoot('.vscode'), this.props);
  }
};
