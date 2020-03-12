
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const path = require("path");
const process = require("process");
const mkdirp = require("mkdirp");
const { warn } = require("console");

const { getAvailableVersions } = require("./utils/version");

module.exports = class extends Generator {

  constructor(args, opts) {

    super(args, opts);

    this.option("template", { type: String });
    this.option("name", { "default": "project", type: String });
    this.option("ui5namespace", { "default": "ui5.project", type: String });
    this.option("ui5resource", { "default": "openui5.hana.ondemand.com", type: String });
    this.option("electron", { "default": false, type: Boolean });
    this.option("cordova", { "default": false, type: Boolean });
    this.option("version", { "default": false, type: String });

  }

  async logLineNew(s = "") {
    // eslint-disable-next-line no-console
    return new Promise(resolve => {
      process.stdout.write(s, resolve);
    });
  }

  clearLine() {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
  }

  async prompting() {

    // Have Yeoman greet the user.
    this.log(yosay("Welcome to the " + chalk.red("generator-ui5g") + " generator!"));

    // >> cli option mode
    if (this.options.template) {

      const [version] = await getAvailableVersions();

      this.log("With cli options configuration.");

      this.props = this.props || {};
      this.props.name = this.options.name;
      this.props.skeleton = this.options.template;
      this.props.dir = this.options.name.replace(/[^a-zA-Z0-9]/g, "");
      this.props.namespace = this.options.ui5namspace;
      this.props.namepath = this.options.namespace.replace(/\./g, "/");
      this.props.ui5Domain = this.options.ui5resource;
      this.props.electron = this.options.electron;
      this.props.cordova = this.options.cordova;
      this.props.version = this.options.version || version;

      if (this.props.namespace.startsWith("sap")) {
        this.log(`The namespace ${this.props.namespace} start with 'sap'\nIt maybe CAUSE error`);
      }

      return;
    }

    // >> interactive mode

    const { skeleton } = await this.prompt({
      type: "list",
      name: "skeleton",
      message: "APP Skeleton?",
      choices: [
        { name: "Empty Project", value: "empty" },
        { name: "Walk Through", value: "wt" },
        { name: "Walk Through (Typescript)", value: "wt-ts" },
        { name: "Shop Admin Tool", value: "admin" }
      ]
    });

    const { name, namespace, ui5type } = await this.prompt([
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
        name: "ui5type",
        message: "OpenUI5 or SAPUI5?",
        choices: [
          {
            name: "OpenUI5",
            value: "openui5",
            checked: true
          },
          {
            name: "SAPUI5",
            value: "sapui5"
          }
        ]
      }

    ]);

    const ui5Domain = (ui5type == "openui5" ? "openui5.hana.ondemand.com" : "sapui5.hana.ondemand.com");

    await this.logLineNew("loading ui5 versions from remote...");

    const availableVersions = await getAvailableVersions(ui5type);

    this.clearLine();

    const { apptype, version } = await this.prompt([
      {
        type: "list",
        name: "version",
        message: "UI5 Version?",
        choices: availableVersions.map((v, i) => ({
          name: v,
          value: v,
          checked: i == 0
        }))
      },
      {
        type: "list",
        name: "apptype",
        message: "App Type?",
        choices: [
          { name: "Web Application", value: "web" },
          { name: "Electron Application", value: "electron" },
          { name: "Cordova Application (Beta)", value: "cordova" }
        ]
      }
    ]);

    const dir = name.replace(/[^a-zA-Z0-9]/g, "");
    const namepath = namespace.replace(/\./g, "/");

    if (namespace.startsWith("sap")) {
      warn(`The namespace ${namespace} start with 'sap'\nIt maybe CAUSE error`);
    }

    this.props = Object.assign(this.props || {}, { dir, namepath, skeleton, name, namespace, ui5Domain, apptype, version });

    switch (apptype) {
    case "electron":
      this.props.electron = true;
      break;
    case "cordova":
      this.props.cordova = true;
      break;
    default:
      break;
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
