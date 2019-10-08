
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const path = require("path");
const process = require("process");
const mkdirp = require("mkdirp");
const { warn } = require("console");

module.exports = class extends Generator {

  constructor(args, opts) {

    super(args, opts);

    this.option("template", { type: String });
    this.option("name", { "default": "project", type: String });
    this.option("ui5namspace", { "default": "ui5.project", type: String });
    this.option("ui5resource", { "default": "openui5.hana.ondemand.com", type: String });
    this.option("electron", { "default": false, type: Boolean });
    this.option("cordova", { "default": false, type: Boolean });

  }

  prompting() {

    // Have Yeoman greet the user.
    this.log(yosay(
      "Welcome to the " + chalk.red("generator-ui5g") + " generator!"
    ));

    if (this.options.template) {

      this.log("With cli options configuration.");

      this.props = this.props || {};
      this.props.name = this.options.name;
      this.props.skeleton = this.options.template;
      this.props.dir = this.options.name.replace(/[^a-zA-Z0-9]/g, "");
      this.props.namespace = this.options.ui5namspace;
      this.props.namepath = this.options.namespace.replace(/\./g, "/");
      this.props.ui5Domain = this.options.ui5resource;
      this.props.electron = this.options.electron;


      if (this.props.namespace.startsWith("sap")) {
        this.log(`The namespace ${this.props.namespace} start with 'sap'\nIt maybe CAUSE error`);
      }
    } else {
      const prompts = [
        {
          type: "list",
          name: "skeleton",
          message: "APP Skeleton?",
          choices: [
            { name: "Empty Project", value: "empty" },
            { name: "Walk Through", value: "wt" },
            { name: "Walk Through (Typescript)", value: "wt-ts" },
            { name: "Shop Admin Tool", value: "admin" }
          ]
        }
      ];

      const projectPrompts = (skeleton = "") => [
        {
          type: "input",
          name: "name",
          message: "App name",
          "default": `ui5-${skeleton.toLowerCase()}`
        },
        {
          type: "input",
          name: "namespace",
          message: "App namespace/package",
          "default": `ui5.${skeleton.replace(/[\W_]+/g, ".").toLowerCase()}`
        },
        {
          type: "list",
          name: "ui5Domain",
          message: "SAPUI5 or OpenUI5?",
          choices: [
            {
              name: "OpenUI5",
              value: "openui5.hana.ondemand.com"
            },
            {
              name: "SAPUI5",
              value: "sapui5.hana.ondemand.com"
            }
          ]
        },
        {
          type: "confirm",
          name: "electron",
          message: "Electron App?",
          "default": false
        },
        {
          type: "confirm",
          name: "cordova",
          when: (props) => !props.electron,
          message: "Cordova App?",
          "default": false
        }
      ];

      return this
        .prompt(prompts)
        .then(props => {
          this.props = props;
          return this.prompt(projectPrompts(props.skeleton));
        })
        .then(props => {
          props.dir = props.name.replace(/[^a-zA-Z0-9]/g, "");
          props.namepath = props.namespace.replace(/\./g, "/");
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

    // if with electron wrapper
    mkdirp(targetPathRoot, () => {

      this.fs.copyTpl(this.templatePath("common"), this.destinationPath(), this.props, {}, { globOptions: { dot: true } });
      this.fs.copyTpl(this.templatePath(this.props.skeleton), this.destinationPath(), this.props, {}, { globOptions: { dot: true } });

      if (this.props.skeleton.endsWith("-ts")) {
        this.fs.copyTpl(this.templatePath("common-ts"), this.destinationPath(), this.props, {}, { globOptions: { dot: true } });
      } else {
        this.fs.copyTpl(this.templatePath("common-js"), this.destinationPath(), this.props, {}, { globOptions: { dot: true } });
      }

      if (this.props.electron) {

        this.fs.copyTpl(this.templatePath("electron"), this.destinationPath(), this.props);

        const oElectronPackageJson = this.fs.readJSON(this.templatePath("electron", ".package.json"));

        oElectronPackageJson.build.appId = this.props.namespace;

        this.fs.extendJSON(this.destinationPath("package.json"), oElectronPackageJson);


      }

      if (this.props.cordova) {

        this.fs.copyTpl(this.templatePath("cordova"), this.destinationPath(), this.props);

        const oCordovaPackageJson = this.fs.readJSON(this.templatePath("cordova", ".package.json"));

        this.fs.extendJSON(this.destinationPath("package.json"), oCordovaPackageJson);

        this.fs.copyTpl(this.templatePath("cordova", "www"), this.destinationPath("www"), this.props, {}, { globOptions: { dot: true } });

      }

      done();
    });

  }

  installing() {
    this.installDependencies({ npm: true, bower: false, yarn: false });
  }

};
