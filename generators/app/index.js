const Generator = require('yeoman-generator');
const klr = require('kleur');
const fs = require('fs');
const defaultFileList = require('./default-templates');

const prompts = [
  {
    type: 'input',
    name: 'projectName',
    message: 'Enter the project name.',
    default: 'labs-spa-project',
    store: true,
  },
  {
    type: 'input',
    name: 'githubRepo',
    message: 'Enter the Labs github repo name.',
    default: 'labs-project1',
    store: true,
  },
  {
    type: 'confirm',
    name: 'hasDS',
    message: 'Does your project have Data Science team members?',
    default: false,
  },
  {
    type: 'list',
    name: 'program',
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
];

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
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

    this.option('program-name', {
      type: String,
      alias: 'p',
      desc: 'Which program will this be used for: "bw" or "labs"',
    });
  }

  _removePrompt(name) {
    prompts.splice(
      prompts.findIndex((element) => name === element.name),
      1
    );
    return prompts;
  }
  _replacePromptsFromOptions(optionMaps) {
    optionMaps.forEach((map) => {
      if (this.options[map.name]) {
        this.initialData[map.prompt] = this.options[map.name];
        this._removePrompt(map.prompt);
      }
    });
  }

  initializing() {
    this._replacePromptsFromOptions([
      { name: 'name', prompt: 'projectName' },
      { name: 'program-name', prompt: 'program' },
    ]);
  }

  prompting() {
    this.log(
      `Welcome to the ${klr.red('Labs')} ${klr.blue(
        'SPA'
      )} generator!\nLets get started.`
    );

    return this.prompt(prompts).then((props) => {
      this.answers = props;
      this.projectDirName = (this.initialData.projectName || props.projectName) + '-fe';
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
