
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const path = require('path');
const process = require('process');
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
      "default": 'ui5-workthrough'
    }, {
      type: 'input',
      name: 'namespace',
      message: 'App namespace',
      "default": 'ui5.demo.walkthrough'
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
      props.dir = props.name.replace(/[^a-zA-Z0-9]/g, '');
      props.namepath = props.namespace.replace(/\./g, '/');
      this.props = props;
    });
  }

  writing() {
    const done = this.async();
    const targetPathRoot = path.join(process.cwd(), this.props.dir);
    this.destinationRoot(targetPathRoot);
    mkdirp(targetPathRoot, () => {
      this.fs.copyTpl(this.templatePath(), this.destinationPath(), this.props);
      this.fs.copyTpl(this.templatePath('.*/**'), this.destinationPath(), this.props);
      this.fs.copyTpl(this.templatePath('.vscode/**'), this.destinationPath('.vscode'), this.props);
      done();
    });
  }

  installing() {
    this.npmInstall();
  }
};
