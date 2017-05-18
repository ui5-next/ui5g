'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {

  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the astounding ' + chalk.red('generator-ui5g') + ' generator!'
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
      default:'sap.ui5.demo.workthrough'
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
    // dot files
    this.fs.copy(this.templatePath('.*'), this.destinationRoot());
    // files
    this.fs.copyTpl(this.sourceRoot(), this.destinationRoot(), this.props, {}, { dot: true });
  }

};
