const BaseGenerator = require('../baseGenerator');
const klr = require('kleur');
const fs = require('fs');

module.exports = class extends BaseGenerator {
  constructor(args, opts) {
    super(args, opts);
    this.initialData = {};

    this.argument('name', {
      type: String,
      desc: 'Name of Project',
    });

    this._makePromptOption(
      'useOkta',
      {
        type: 'confirm',
        message: 'Does this page need Okta User Info?',
        default: false,
      },
      {
        type: Boolean,
        alias: 'o',
        desc: 'include the okta auth state for user info',
      }
    );
  }

  initializing() {
    const name = this.initialData.name = this.options.name.substr(0,1).toUpperCase() + this.options.name.substr(1);
    this.projectDirName                 = name;
    this.initialData.pageClassName      = name + 'Page';
    this.initialData.pageContainerName  = `${name}Container`;
    this.initialData.pageRenderName     = `Render${this.initialData.pageClassName}`;
    this.log(
      `Welcome to the ${klr.red('Labs')} ${klr.blue(
        'SPA'
      )} page generator!\nInitializing for page ${klr.bold(
        name
      )}`
    );
    this._removePrompts();
  }

  prompting() {
    return this.prompt(this.prompts).then((props) => {
      this.answers = props;
      this.data = Object.assign({}, this.initialData, this.answers);
    });
  }

  configuring() {
    
  }

  writing() {
    this.destinationRoot(`src/components/pages/${this.projectDirName}`);

    [
      { src: 'container.js' },
      { src: 'index.js' },
      { src: 'render.js' },
    ].forEach((file) => {
      return this.fs.copyTpl(
        this.templatePath(file.src),
        this.destinationPath(file.dest || file.src),
        this.data,
        {},
        { globOptions: { ignore: [] } }
      );
    });
  }
}