const Generator = require('yeoman-generator');
const klr = require('kleur');
const fs = require('fs');
const defaultFileList = require('./default-templates');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.prompts = [];
    this.initialData = {
      includeCodeAnalysisBadge: false,
      includeCoverageBadge: false,
    };
    this.templateFiles = [].concat(defaultFileList);
    this.removePackages = ['kleur', 'yaml', 'prompts'];

    this.argument('name', {
      type: String,
      desc: 'Name of Project',
    });

    this._addPromptOption(
      'program',
      {
        type: 'list',
        message: 'What is the project type?',
        choices: [
          {
            name: 'Buid Weeks',
            value: 'bw',
          },
          {
            name: 'Labs',
            value: 'labs',
          },
        ],
        default: 'labs',
        store: true,
      },
      {
        type: String,
        alias: 'p',
        desc: 'Which program will this be used for: "bw" or "labs"',
      }
    );
    this._addPromptOption(
      'repoName',
      {
        type: 'input',
        message: 'Enter the Labs github repo name.',
        default: 'labs-project1',
        store: true,
      },
      {
        type: String,
        alias: 'r',
        desc: 'name of your github repo',
      }
    );
    this._addPromptOption(
      'hasDS',
      {
        type: 'confirm',
        message: 'Does your project have Data Science team members?',
        default: false,
      },
      {
        type: Boolean,
        alias: 'd',
        desc: 'project has DS team members',
      }
    );
  }

  _addPromptOption(name, promptOpts, optionOpts) {
    optionOpts.name = promptOpts.name = name;
    if (optionOpts.alias) promptOpts.alias = optionOpts.alias;
    this.option(name, optionOpts);
    this.prompts.push(promptOpts);
  }

  _removePrompt(name) {
    this.prompts.splice(
      this.prompts.findIndex((element) => name === element.name),
      1
    );
    return this.prompts;
  }

  initializing() {
    this.log(
      `Welcome to the ${klr.red('Labs')} ${klr.blue(
        'SPA'
      )} generator!\nLets get started.\nInitializing for project ${klr.bold(
        this.options.name
      )}`
    );
    var promptsToRemove = [];
    this.prompts.forEach((prompt) => {
      if (this.options[prompt.name] || this.options[prompt.alias]) {
        this.initialData[prompt.name] = this.options[prompt.name];
        promptsToRemove.push(prompt.name);
      }
    });
    promptsToRemove.forEach((prompt) => this._removePrompt(prompt));
    this.initialData.projectName = this.options.name;
  }

  prompting() {
    return this.prompt(this.prompts).then((props) => {
      this.answers = props;
      this.projectDirName =
        (this.initialData.projectName || props.projectName) + '-fe';
      this.data = Object.assign({}, this.initialData, this.answers);
    });
  }

  configuring() {
    if (!fs.existsSync(this.projectDirName)) {
      fs.mkdirSync(this.projectDirName);
    }
    if (this.program === 'labs') {
      this.data.includeCodeAnalysisBadge = true;
      this.data.includeCoverageBadge = true;
    }
    if (!this.data.hasDS) {
      this.removePackages.push('plotly.js');
      this.removePackages.push('react-plotly.js');
    }
    if (this.data.program === 'bw') {
      this.removePackages.concat([
        '@okta/okta-react',
        '@okta/okta-signin-widget',
        '@storybook/addon-actions',
        '@storybook/addon-knobs',
        '@storybook/addon-notes',
        '@storybook/addons',
        '@storybook/storybook-deployer',
        'antd',
      ]);
    }
  }

  writing() {
    const ignorePaths = [];
    this.log(this.data);
    this.destinationRoot(this.projectDirName);
    if (this.data.program === 'labs') {
      this.templateFiles.push({ src: '.storybook/**', dest: '.storybook' });
      this.templateFiles.push({ src: 'amplify.yml' });
    } else {
      ignorePaths.push('**/stories/**');
      ignorePaths.push('**/styles/**');
      ignorePaths.push('**/utils/oktaConfig.js');
      ignorePaths.push('**/pages/Home/**');
      ignorePaths.push('**/__tests__/Home.test.js');
      ignorePaths.push('**/pages/ProfileList/**');
      ignorePaths.push('**/__tests__/ProfileListContainer.test.js');
      ignorePaths.push('**/pages/Login/**');
      ignorePaths.push('**/__tests__/LoginContainer.test.js');
      ignorePaths.push('**/__tests__/RenderExampleListPage.test.js');
      ignorePaths.push('**/__tests__/RenderHomePage.test.js');
      ignorePaths.push('**/__tests__/RenderProfileListPage.test.js');
    }

    if (!this.data.hasDS) {
      ignorePaths.push('**/ExampleDataViz/**');
    }
    this.log('ignorePaths', ignorePaths);
    this.templateFiles.forEach((file) => {
      return this.fs.copyTpl(
        this.templatePath(file.src),
        this.destinationPath(file.dest || file.src),
        this.data,
        {},
        { globOptions: { ignore: ignorePaths } }
      );
    });
  }

  installing() {}
};
