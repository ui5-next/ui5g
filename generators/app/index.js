
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const path = require('path');
const process = require('process');
const mkdirp = require('mkdirp');
const { warn } = require("console");

module.exports = class extends Generator {

  constructor(args, opts) {
    super(args, opts);
    this.option("template", { type: String });
    this.option("name", { "default": "project", type: String });
    this.option("namespace", { "default": "ui5.project", type: String });
    this.option("ui5resource", { "default": "openui5.hana.ondemand.com", type: String });
  }

  prompting() {

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the ' + chalk.red('generator-ui5g') + ' generator!'
    ));

    if (this.options.template) {
      this.log("With cli options configuration.");
      this.props = this.props || {};
      this.props.name = this.options.name;
      this.props.skeleton = this.options.template;
      this.props.dir = this.options.name.replace(/[^a-zA-Z0-9]/g, '');
      this.props.namespace = this.options.namespace;
      this.props.namepath = this.options.namespace.replace(/\./g, '/');
      this.props.ui5Domain = this.options.ui5resource;
      if (this.props.namespace.startsWith("sap")) {
        this.log(`The namespace ${this.props.namespace} start with 'sap'\nIt maybe CAUSE error`);
      }
    } else {
      const prompts = [
        {
          type: 'list',
          name: 'skeleton',
          message: 'APP Skeleton?',
          choices: [
            {
              name: 'Walk through',
              value: 'wt'
            },
            {
              name: 'Shop Administration Tool',
              value: 'admin'
            },
            {
              name: 'Empty Project',
              value: 'empty'
            }
          ]
        }
      ];
      const projectPrompts = (skeleton = "") => [
        {
          type: 'input',
          name: 'name',
          message: 'App name',
          "default": `ui5-${skeleton.toLowerCase()}`
        },
        {
          type: 'input',
          name: 'namespace',
          message: 'App namespace/package',
          "default": `ui5.${skeleton.toLowerCase()}`
        },
        {
          type: 'list',
          name: 'ui5Domain',
          message: 'SAPUI5 or OpenUI5?',
          choices: [
            {
              name: 'OpenUI5',
              value: 'openui5.hana.ondemand.com'
            },
            {
              name: 'SAPUI5',
              value: 'sapui5.hana.ondemand.com'
            }
          ]
        }
      ];

      return this
        .prompt(prompts)
        .then(props => {
          this.props = props;
          return this.prompt(projectPrompts(props.skeleton));
        })
        .then(props => {
          props.dir = props.name.replace(/[^a-zA-Z0-9]/g, '');
          props.namepath = props.namespace.replace(/\./g, '/');
          if (props.namespace.startsWith("sap")) {
            warn(`The namespace ${props.namespace} start with 'sap'\nIt maybe CAUSE error`);
          }
          this.props = Object.assign(this.props, props);
        });
    }

  }

  writing() {
    const done = this.async();
    const targetPathRoot = path.join(process.cwd(), this.props.dir);
    this.destinationRoot(targetPathRoot);
    mkdirp(targetPathRoot, () => {
      this.fs.copyTpl(this.templatePath("common"), this.destinationPath(), this.props);
      this.fs.copyTpl(this.templatePath("common", ".*/**"), this.destinationPath(), this.props);
      this.fs.copyTpl(this.templatePath("common", ".vscode/**"), this.destinationPath('.vscode'), this.props);
      this.fs.copyTpl(this.templatePath(this.props.skeleton), this.destinationPath(), this.props);
      done();
    });
  }

  installing() {
    this.installDependencies({ npm: true, bower: false, yarn: false });
  }
};
