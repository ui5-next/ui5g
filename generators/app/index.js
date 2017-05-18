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
      message: 'App name'
    }, {
      type: 'input',
      name: 'namespace',
      message: 'App namespace'
    },
    {
      type: 'list',
      name: 'ui5Domain',
      message: 'SAPUI5 or OpenUI5?',
      choices: [{
        name: 'SAPUI5',
        value: '<%= ui5Domain %>'
      }, {
        name: 'OpenUI5',
        value: 'openui5.hana.ondemand.com'
      }]
    }];

    return this.prompt(prompts).then(props => {
      props.namepath = props.namespace.replace(/\./g, '/');
      this.props = props;
    });
  }

  writing() {
    this.fs.copyTpl(this.templatePath(), this.destinationPath(), this.props);
  }

};
